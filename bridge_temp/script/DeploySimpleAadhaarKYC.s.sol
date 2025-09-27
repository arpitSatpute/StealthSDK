// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/SimpleAadhaarKYC.sol";

contract DeploySimpleAadhaarKYC is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("CELO_PRIVATE_KEY");
        address celoLzEndpoint = vm.envAddress("CELO_LZ_ENDPOINT");
        uint16 polygonChainId = uint16(vm.envUint("POLYGON_CHAIN_ID"));
        
        // You need to provide the KYC Checker address from Polygon deployment
        address kycCheckerAddress = vm.envAddress("KYC_CHECKER_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleAadhaarKYC aadhaarKYC = new SimpleAadhaarKYC(
            celoLzEndpoint,
            polygonChainId,
            kycCheckerAddress
        );
        
        // Fund the contract with some CELO for LayerZero fees
        payable(address(aadhaarKYC)).transfer(0.01 ether);
        
        vm.stopBroadcast();
        
        console.log("=== CELO ALFAJORES DEPLOYMENT ===");
        console.log("SimpleAadhaarKYC deployed to:", address(aadhaarKYC));
        console.log("LayerZero Endpoint:", celoLzEndpoint);
        console.log("Target Chain ID:", polygonChainId);
        console.log("KYC Checker Address:", kycCheckerAddress);
        console.log("Funded with 0.01 CELO for fees");
        console.log("");
        console.log("Next steps:");
        console.log("1. Set trusted remote on KYCChecker contract");
        console.log("2. Test KYC verification flow");
    }
}