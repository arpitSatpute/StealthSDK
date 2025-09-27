// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PoolContract is Ownable, ReentrancyGuard {
    // ERC-20 token address
    IERC20 public immutable token;
    
    // Minimum blocks before withdrawal (mixing delay)
    uint256 public constant WITHDRAW_DELAY_BLOCKS = 5;
    
    // Struct to store deposit info
    struct Deposit {
        uint256 amount;
        uint256 depositBlock;
    }
    
    // Mapping: hashed user ID => Deposit
    mapping(bytes32 => Deposit) private deposits;
    
    // Total pooled amount
    uint256 public totalPooled;
    
    // Events
    event Deposited(bytes32 indexed userId, uint256 amount);
    event Withdrawn(bytes32 indexed userId, uint256 amount, address stealthAddr);
    
    // Constructor: Set token address and owner
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }
    
    // Deposit function: Accepts ERC-20 tokens
    function deposit(uint256 amount, bytes32 userId) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(deposits[userId].amount == 0, "User ID already has a deposit");
        
        // Transfer ERC-20 tokens from caller (FragmentManager) to contract
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        deposits[userId] = Deposit({
            amount: amount,
            depositBlock: block.number
        });
        
        totalPooled += amount;
        emit Deposited(userId, amount);
    }
    
    // Withdraw function: Sends to stealth address after delay
    function withdraw(bytes32 userId, address stealthAddr) external nonReentrant {
        Deposit memory userDeposit = deposits[userId];
        require(userDeposit.amount > 0, "No deposit found for user ID");
        require(block.number >= userDeposit.depositBlock + WITHDRAW_DELAY_BLOCKS, "Withdraw delay not met");
        require(stealthAddr != address(0), "Invalid stealth address");
        
        uint256 amount = userDeposit.amount;
        totalPooled -= amount;
        delete deposits[userId];
        
        // Transfer ERC-20 tokens to stealth address
        require(token.transfer(stealthAddr, amount), "Token transfer failed");
        
        emit Withdrawn(userId, amount, stealthAddr);
    }
    
    // Get deposit details for a user ID
    function getDeposit(bytes32 userId) external view returns (uint256 amount, uint256 depositBlock) {
        Deposit memory userDeposit = deposits[userId];
        return (userDeposit.amount, userDeposit.depositBlock);
    }
    
    // Emergency stop: Owner can withdraw all tokens (for hackathon safety)
    function emergencyWithdraw(address to) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(to, balance), "Emergency token transfer failed");
    }
}