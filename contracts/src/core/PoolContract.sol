// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PoolContract is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    uint256 public constant WITHDRAW_DELAY_BLOCKS = 5;

    struct Deposit {
        uint256 amount;
        uint256 depositBlock;
    }

    mapping(address => Deposit) private deposits;
    uint256 public totalPooled;

    event Deposited(address indexed stealthAddress, uint256 amount, bytes32 indexed txId);
    event Withdrawn(address indexed stealthAddress, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    function deposit(uint256 amount, address stealthAddress, bytes32 txId) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stealthAddress != address(0), "Invalid stealth address");
        require(txId != bytes32(0), "Invalid transaction ID");

        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        deposits[stealthAddress] = Deposit({
            amount: amount,
            depositBlock: block.number
        });

        totalPooled += amount;
        emit Deposited(stealthAddress, amount, txId);
    }

    function withdraw(address stealthAddress) external nonReentrant {
        Deposit memory userDeposit = deposits[stealthAddress];
        require(userDeposit.amount > 0, "No deposit found for stealth address");
        require(block.number >= userDeposit.depositBlock + WITHDRAW_DELAY_BLOCKS, "Withdraw delay not met");
        require(stealthAddress != address(0), "Invalid stealth address");

        uint256 amount = userDeposit.amount;
        totalPooled -= amount;
        delete deposits[stealthAddress];

        require(token.transfer(stealthAddress, amount), "Token transfer failed");

        emit Withdrawn(stealthAddress, amount);
    }

    function getDeposit(address stealthAddress) external view returns (uint256 amount, uint256 depositBlock) {
        Deposit memory userDeposit = deposits[stealthAddress];
        return (userDeposit.amount, userDeposit.depositBlock);
    }

    function emergencyWithdraw(address to) external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(to, balance), "Emergency token transfer failed");
    }
}