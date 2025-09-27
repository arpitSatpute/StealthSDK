// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PoolContract.sol";

contract FragmentManager is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    // Named pools: PoolA, PoolB, PoolC, PoolD
    address public immutable poolA;
    address public immutable poolB;
    address public immutable poolC;
    address public immutable poolD;
    
    // Mapping to track total deposited per userId
    mapping(bytes32 => uint256) public totalDeposited;
    
    // Events
    event FragmentsDeposited(bytes32 indexed userId, uint256[] amounts, uint256 level);
    event FragmentsWithdrawn(bytes32 indexed userId, uint256[] amounts, address stealthAddr, uint256 level);
    
    // Constructor: Set token and pool addresses
    constructor(
        address _token,
        address _poolA,
        address _poolB,
        address _poolC,
        address _poolD
    ) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        require(_poolA != address(0), "Invalid PoolA address");
        require(_poolB != address(0), "Invalid PoolB address");
        require(_poolC != address(0), "Invalid PoolC address");
        require(_poolD != address(0), "Invalid PoolD address");
        token = IERC20(_token);
        poolA = _poolA;
        poolB = _poolB;
        poolC = _poolC;
        poolD = _poolD;
    }
    
    // Deposit fragments: Called by frontend with AI-generated amounts
    function depositFragments(
        uint256[] calldata amounts,
        bytes32 userId,
        uint256 level
    ) external nonReentrant {
        require(level >= 1 && level <= 4, "Level must be 1-4");
        require(amounts.length == level, "Fragment count must match level");
        
        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Fragment amount must be positive");
            total += amounts[i];
        }
        require(total > 0, "Total amount must be positive");
        
        // Transfer total from sender to this contract
        require(token.transferFrom(msg.sender, address(this), total), "Token transfer failed");
        
        // Update tracking
        totalDeposited[userId] += total;
        
        // Call deposit on each pool based on level
        for (uint256 i = 0; i < amounts.length; i++) {
            address pool;
            if (i == 0) pool = poolA;
            else if (i == 1) pool = poolB;
            else if (i == 2) pool = poolC;
            else pool = poolD;
            
            require(token.approve(pool, amounts[i]), "Pool approval failed");
            PoolContract(pool).deposit(amounts[i], userId);
        }
        
        emit FragmentsDeposited(userId, amounts, level);
    }
    
    // Withdraw fragments: Called by frontend with AI-generated amounts
    function withdrawFragments(
        uint256[] calldata amounts,
        bytes32 userId,
        address stealthAddr,
        uint256 level
    ) external nonReentrant {
        require(level >= 1 && level <= 4, "Level must be 1-4");
        require(amounts.length == level, "Fragment count must match level");
        require(stealthAddr != address(0), "Invalid stealth address");
        
        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Fragment amount must be positive");
            total += amounts[i];
        }
        require(total == totalDeposited[userId], "Total must match deposited amount");
        
        // Reset tracking
        totalDeposited[userId] = 0;
        
        // Call withdraw on each pool based on level
        for (uint256 i = 0; i < amounts.length; i++) {
            address pool;
            if (i == 0) pool = poolA;
            else if (i == 1) pool = poolB;
            else if (i == 2) pool = poolC;
            else pool = poolD;
            
            PoolContract(pool).withdraw(userId, stealthAddr);
        }
        
        emit FragmentsWithdrawn(userId, amounts, stealthAddr, level);
    }
    
    // View function: Get pool addresses
    function getPools() external view returns (address[4] memory) {
        return [poolA, poolB, poolC, poolD];
    }
    
    // Emergency withdraw: Owner recovers tokens
    function emergencyWithdraw(address to) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(to, balance), "Emergency transfer failed");
    }
}