// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PoolContract.sol";

contract FragmentManager is Ownable, ReentrancyGuard {
    IERC20 public immutable token;
    address public immutable poolA;
    address public immutable poolB;
    address public immutable poolC;
    address public immutable poolD;

    // Existing mappings
    mapping(address => mapping(uint256 => uint256)) public userPoolDeposits;
    mapping(address => uint256) public totalDeposits;
    // New mapping to associate stealthAddress and txId with total deposit amount
    mapping(address => mapping(bytes32 => uint256)) public depositsByTxId;

    event FragmentsDeposited(address indexed stealthAddress, uint256[] amounts, uint256 level, bytes32 indexed txId);

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

    function depositFragments(
        uint256[] calldata amounts,
        address stealthAddress,
        uint256 level,
        bytes32 txId
    ) external nonReentrant {
        require(level >= 1 && level <= 4, "Level must be 1-4");
        require(amounts.length == level, "Fragment count must match level");
        require(txId != bytes32(0), "Invalid transaction ID");
        require(depositsByTxId[stealthAddress][txId] == 0, "Transaction ID already used");

        uint256 total;
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Fragment amount must be positive");
            total += amounts[i];
        }
        require(total > 0, "Total amount must be positive");

        require(token.transferFrom(msg.sender, address(this), total), "Token transfer failed");

        totalDeposits[stealthAddress] += total;
        // Map the total deposit amount to txId
        depositsByTxId[stealthAddress][txId] = total;

        for (uint256 i = 0; i < amounts.length; i++) {
            address pool;
            if (i == 0) pool = poolA;
            else if (i == 1) pool = poolB;
            else if (i == 2) pool = poolC;
            else pool = poolD;

            require(token.approve(pool, amounts[i]), "Pool approval failed");
            PoolContract(pool).deposit(amounts[i], stealthAddress, txId);
            userPoolDeposits[stealthAddress][i] = amounts[i];
        }

        emit FragmentsDeposited(stealthAddress, amounts, level, txId);
    }

    function getUserDeposits(address stealthAddress) external view returns (
        address[] memory pools,
        uint256[] memory amounts
    ) {
        uint256 level = 0;
        for (uint256 i = 0; i < 4; i++) {
            if (userPoolDeposits[stealthAddress][i] > 0) {
                level++;
            }
        }

        pools = new address[](level);
        amounts = new uint256[](level);
        uint256 index = 0;

        for (uint256 i = 0; i < 4; i++) {
            if (userPoolDeposits[stealthAddress][i] > 0) {
                if (i == 0) pools[index] = poolA;
                else if (i == 1) pools[index] = poolB;
                else if (i == 2) pools[index] = poolC;
                else pools[index] = poolD;
                amounts[index] = userPoolDeposits[stealthAddress][i];
                index++;
            }
        }

        return (pools, amounts);
    }

    function getDepositByTxId(address stealthAddress, bytes32 txId) external view returns (uint256 totalAmount) {
        return depositsByTxId[stealthAddress][txId];
    }

    function getPools() external view returns (address[4] memory) {
        return [poolA, poolB, poolC, poolD];
    }
}