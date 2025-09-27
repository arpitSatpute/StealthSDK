// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../../../lib/openzeppelin-contracts/lib/forge-std/src/Script.sol";
import "../src/KYCChecker.sol";

contract DeployKYCCheckerPolygon is Script {
    function run() external {
        // Polygon Amoy configuration
        address POLYGON_LZ_ENDPOINT = 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0; // Polygon Amoy LayerZero endpoint
        address AADHAAR_KYC_ADDRESS = 0x0000000000000000000000000000000000000000; // Replace with AadhaarKYC address from Celo
        uint16 CELO_ALFAJORES_CHAIN_ID = 10132; // Celo Alfajores LayerZero Chain ID
        
        vm.startBroadcast();
        
        KYCChecker kycChecker = new KYCChecker(
            POLYGON_LZ_ENDPOINT,
            AADHAAR_KYC_ADDRESS,
            CELO_ALFAJORES_CHAIN_ID
        );
        
        vm.stopBroadcast();
        
        console.log("KYCChecker deployed to:", address(kycChecker));
        console.log("Remember to:");
        console.log("1. Set trusted remote with AadhaarKYC address:");
        console.log("   setTrustedRemote(10132, abi.encodePacked(AadhaarKYCAddress))");
        console.log("2. Update AadhaarKYC constructor with this KYCChecker address");
    }
}