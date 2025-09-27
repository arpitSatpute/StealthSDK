// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/SimpleKYCChecker.sol";

contract DeploySimpleKYCChecker is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        address polygonLzEndpoint = vm.envAddress("POLYGON_LZ_ENDPOINT");
        uint16 celoChainId = uint16(vm.envUint("CELO_CHAIN_ID"));
        
        // For initial deployment, use zero address for celo sender (will update later)
        address celoSender = address(0);
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleKYCChecker kycChecker = new SimpleKYCChecker(
            polygonLzEndpoint,
            celoSender,
            celoChainId
        );
        
        vm.stopBroadcast();
        
        console.log("=== POLYGON AMOY DEPLOYMENT ===");
        console.log("SimpleKYCChecker deployed to:", address(kycChecker));
        console.log("LayerZero Endpoint:", polygonLzEndpoint);
        console.log("Expected Celo Chain ID:", celoChainId);
        console.log("");
        console.log("Next steps:");
        console.log("1. Deploy SimpleAadhaarKYC on Celo with this address");
        console.log("2. Update the celoSender address in this contract");
        console.log("3. Set trusted remotes on both contracts");
    }
}