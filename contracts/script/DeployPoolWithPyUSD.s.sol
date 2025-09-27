// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/tokens/PyUSD.sol";
import "../src/core/PoolContract.sol";

contract DeployPoolWithPyUSDScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploying PyUSD and Pool Contract ===");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        
        // Deploy PyUSD Token first
        VUSDTToken pyusd = new VUSDTToken();
        console.log("\n1. PyUSD Token deployed to:", address(pyusd));
        console.log("   Token Name:", pyusd.name());
        console.log("   Token Symbol:", pyusd.symbol());
        console.log("   Owner:", pyusd.owner());
        
        // Deploy Pool Contract with PyUSD token address
        PoolContract pool = new PoolContract(address(pyusd));
        console.log("\n2. Pool Contract deployed to:", address(pool));
        console.log("   Pool Token:", address(pool.token()));
        console.log("   Pool Owner:", pool.owner());
        console.log("   Withdraw Delay Blocks:", pool.WITHDRAW_DELAY_BLOCKS());
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("PyUSD Token Address:", address(pyusd));
        console.log("Pool Contract Address:", address(pool));
        console.log("\n=== Next Steps ===");
        console.log("1. Claim PyUSD airdrop for testing");
        console.log("2. Approve Pool contract to spend PyUSD");
        console.log("3. Test deposit/withdraw functionality");
    }
}