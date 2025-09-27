// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../../../lib/openzeppelin-contracts/lib/forge-std/src/Script.sol";
import "../src/AadhaarKYC.sol";

contract DeployAadhaarKYCCelo is Script {
    function run() external {
        // Celo Alfajores configuration
        address SELF_PROTOCOL_HUB = 0x0000000000000000000000000000000000000000; // Replace with actual Self Protocol hub address
        uint256 SCOPE_SEED = 12345; // Replace with actual scope seed
        address CELO_LZ_ENDPOINT = 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0; // Celo Alfajores LayerZero endpoint
        uint16 POLYGON_AMOY_CHAIN_ID = 10160; // Polygon Amoy LayerZero Chain ID
        address KYC_CHECKER_ADDRESS = 0x0000000000000000000000000000000000000000; // Replace with KYCChecker address after deployment
        
        vm.startBroadcast();
        
        AadhaarKYC aadhaarKYC = new AadhaarKYC(
            SELF_PROTOCOL_HUB,
            SCOPE_SEED,
            CELO_LZ_ENDPOINT,
            POLYGON_AMOY_CHAIN_ID,
            KYC_CHECKER_ADDRESS
        );
        
        vm.stopBroadcast();
        
        console.log("AadhaarKYC deployed to:", address(aadhaarKYC));
        console.log("Remember to:");
        console.log("1. Fund the contract with CELO for LayerZero fees");
        console.log("2. Set trusted remote with KYCChecker address:");
        console.log("   setTrustedRemote(10160, abi.encodePacked(KYCCheckerAddress))");
    }
}