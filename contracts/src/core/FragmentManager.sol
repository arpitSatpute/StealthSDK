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
        
        // Mapping: stealthAddress => poolIndex => amount
        mapping(address => mapping(uint256 => uint256)) public userPoolDeposits;
        
        // Mapping to track total deposits per user
        mapping(address => uint256) public totalDeposits;
        
        // Events
        event FragmentsDeposited(address indexed stealthAddress, uint256[] amounts, uint256 level);
        
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
            address stealthAddress,
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
            totalDeposits[stealthAddress] += total;
            
            // Call deposit on each pool based on level and track deposits
            for (uint256 i = 0; i < amounts.length; i++) {
                address pool;
                if (i == 0) pool = poolA;
                else if (i == 1) pool = poolB;
                else if (i == 2) pool = poolC;
                else pool = poolD;
                
                require(token.approve(pool, amounts[i]), "Pool approval failed");
                PoolContract(pool).deposit(amounts[i], stealthAddress);
                userPoolDeposits[stealthAddress][i] = amounts[i];
            }
            
            emit FragmentsDeposited(stealthAddress, amounts, level);
        }
        
        // View function: Get pool addresses and deposit amounts for a user
        function getUserDeposits(address stealthAddress) external view returns (
            address[] memory pools,
            uint256[] memory amounts
        ) {
            uint256 level = 0;
            // Determine the number of pools with deposits
            for (uint256 i = 0; i < 4; i++) {
                if (userPoolDeposits[stealthAddress][i] > 0) {
                    level++;
                }
            }
            
            // Initialize arrays
            pools = new address[](level);
            amounts = new uint256[](level);
            uint256 index = 0;
            
            // Populate arrays with non-zero deposits
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
        
        // View function: Get pool addresses
        function getPools() external view returns (address[4] memory) {
            return [poolA, poolB, poolC, poolD];
        }
    }