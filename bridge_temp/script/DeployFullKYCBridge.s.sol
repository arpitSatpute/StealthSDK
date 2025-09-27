// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/AadhaarKYC.sol";
import "../src/KYCChecker.sol";

contract DeployFullKYCBridge is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("CELO_PRIVATE_KEY");
        
        // Contract addresses
        address SELF_PROTOCOL_HUB = 0x68c931C9a534D37aa78094877F46fE46a49F1A51; // Celo Alfajores
        address CELO_LZ_ENDPOINT = vm.envAddress("CELO_LZ_ENDPOINT");
        address POLYGON_LZ_ENDPOINT = vm.envAddress("POLYGON_LZ_ENDPOINT");
        uint16 POLYGON_LZ_CHAIN_ID = uint16(vm.envUint("POLYGON_CHAIN_ID"));
        uint16 CELO_LZ_CHAIN_ID = uint16(vm.envUint("CELO_CHAIN_ID"));
        uint256 SCOPE_SEED = 12345; // Choose a unique seed for your verification scope
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy AadhaarKYC on Celo Alfajores
        console.log("Deploying AadhaarKYC on Celo Alfajores...");
        AadhaarKYC aadhaarKYC = new AadhaarKYC(
            SELF_PROTOCOL_HUB,
            SCOPE_SEED,
            CELO_LZ_ENDPOINT,
            POLYGON_LZ_CHAIN_ID,
            address(0) // Placeholder; update with KYCChecker address after deployment
        );
        
        vm.stopBroadcast();
        
        console.log("AadhaarKYC deployed to:", address(aadhaarKYC));
        console.log("Switch to Polygon Amoy network and deploy KYCChecker with this address as celoSender");
        
        // Note: KYCChecker should be deployed separately on Polygon Amoy
        // Then call aadhaarKYC.setReceiver(kycCheckerAddress) on Celo
    }
}

contract DeployKYCCheckerPolygon is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        address POLYGON_LZ_ENDPOINT = vm.envAddress("POLYGON_LZ_ENDPOINT");
        uint16 CELO_LZ_CHAIN_ID = uint16(vm.envUint("CELO_CHAIN_ID"));
        
        // This should be the deployed AadhaarKYC address from Celo
        address celoAadhaarKYCAddress = vm.envAddress("CELO_AADHAAR_KYC_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("Deploying KYCChecker on Polygon Amoy...");
        KYCChecker kycChecker = new KYCChecker(
            POLYGON_LZ_ENDPOINT,
            celoAadhaarKYCAddress,
            CELO_LZ_CHAIN_ID
        );
        
        vm.stopBroadcast();
        
        console.log("KYCChecker deployed to:", address(kycChecker));
        console.log("Now call setReceiver on AadhaarKYC with this address:", address(kycChecker));
    }
}