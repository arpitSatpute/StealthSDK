// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/core/PoolContract.sol";

contract DeployMultiplePoolsScript is Script {
    // Existing PyUSD token address from previous deployment
    address constant PYUSD_TOKEN_ADDRESS = 0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1;
    
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploying 3 Additional Pool Contracts ===");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Using PyUSD Token:", PYUSD_TOKEN_ADDRESS);
        
        // Deploy Pool Contract #2
        PoolContract pool2 = new PoolContract(PYUSD_TOKEN_ADDRESS);
        console.log("\n1. Pool Contract #2 deployed to:", address(pool2));
        console.log("   Pool Token:", address(pool2.token()));
        console.log("   Pool Owner:", pool2.owner());
        console.log("   Withdraw Delay Blocks:", pool2.WITHDRAW_DELAY_BLOCKS());
        
        // Deploy Pool Contract #3
        PoolContract pool3 = new PoolContract(PYUSD_TOKEN_ADDRESS);
        console.log("\n2. Pool Contract #3 deployed to:", address(pool3));
        console.log("   Pool Token:", address(pool3.token()));
        console.log("   Pool Owner:", pool3.owner());
        console.log("   Withdraw Delay Blocks:", pool3.WITHDRAW_DELAY_BLOCKS());
        
        // Deploy Pool Contract #4
        PoolContract pool4 = new PoolContract(PYUSD_TOKEN_ADDRESS);
        console.log("\n3. Pool Contract #4 deployed to:", address(pool4));
        console.log("   Pool Token:", address(pool4.token()));
        console.log("   Pool Owner:", pool4.owner());
        console.log("   Withdraw Delay Blocks:", pool4.WITHDRAW_DELAY_BLOCKS());
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("PyUSD Token Address (Existing):", PYUSD_TOKEN_ADDRESS);
        console.log("Pool Contract #1 (Existing):", "0x821E700b376F12c14b6878Db70Df6e07B01E5792");
        console.log("Pool Contract #2 (New):", address(pool2));
        console.log("Pool Contract #3 (New):", address(pool3));
        console.log("Pool Contract #4 (New):", address(pool4));
        
        console.log("\n=== Next Steps ===");
        console.log("1. All pools use the same PyUSD token");
        console.log("2. Test deposit/withdraw functionality on different pools");
        console.log("3. Each pool is independent with its own deposits");
    }
}