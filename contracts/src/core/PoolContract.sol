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
    mapping(address => Deposit) private deposits;
    
    // Total pooled amount
    uint256 public totalPooled;
    
    // Events
    event Deposited(address indexed stealthAddress, uint256 amount);
    event Withdrawn(address indexed stealthAddress, uint256 amount);
    
    // Constructor: Set token address and owner
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }
    
    // Deposit function: Accepts ERC-20 tokens
    function deposit(uint256 amount, address stealthAddress) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stealthAddress != address(0), "Invalid user ID");
        
        // Transfer ERC-20 tokens from caller (FragmentManager) to contract
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        deposits[stealthAddress] = Deposit({
            amount: amount,
            depositBlock: block.number
        });
        
        totalPooled += amount;
        emit Deposited(stealthAddress, amount);
    }
    
    // Withdraw function: Sends to stealth address after delay
    function withdraw(address stealthAddress) external nonReentrant {
        Deposit memory userDeposit = deposits[stealthAddress];
        require(userDeposit.amount > 0, "No deposit found for user ID");
        require(block.number >= userDeposit.depositBlock + WITHDRAW_DELAY_BLOCKS, "Withdraw delay not met");
        require(stealthAddress != address(0), "Invalid stealth address");
        
        uint256 amount = userDeposit.amount;
        totalPooled -= amount;
        delete deposits[stealthAddress];
        
        // Transfer ERC-20 tokens to stealth address
        require(token.transfer(stealthAddress, amount), "Token transfer failed");
        
        emit Withdrawn(stealthAddress, amount);
    }
    
    // Get deposit details for a user ID
    function getDeposit(address stealthAddress) external view returns (uint256 amount, uint256 depositBlock) {
        Deposit memory userDeposit = deposits[stealthAddress];
        return (userDeposit.amount, userDeposit.depositBlock);
    }
    
    // Emergency stop: Owner can withdraw all tokens (for hackathon safety)
    function emergencyWithdraw(address to) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(to, balance), "Emergency token transfer failed");
    }
}