// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../../../lib/forge-std/src/Script.sol";
import "../src/SimpleKYCChecker.sol";
import "../src/SimpleAadhaarKYC.sol";

contract DeployCompleteBridge is Script {
    
    function deployKYCChecker() public returns (address) {
        console.log("=== DEPLOYING KYC CHECKER ON POLYGON AMOY ===");
        
        // Load Polygon environment variables
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        address polygonLzEndpoint = vm.envAddress("POLYGON_LZ_ENDPOINT");
        uint16 celoChainId = uint16(vm.envUint("CELO_CHAIN_ID"));
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleKYCChecker kycChecker = new SimpleKYCChecker(
            polygonLzEndpoint,
            address(0), // Will be updated after Celo deployment
            celoChainId
        );
        
        vm.stopBroadcast();
        
        console.log("SimpleKYCChecker deployed to:", address(kycChecker));
        return address(kycChecker);
    }
    
    function deployAadhaarKYC(address kycCheckerAddress) public returns (address) {
        console.log("=== DEPLOYING AADHAAR KYC ON CELO ALFAJORES ===");
        
        // Load Celo environment variables
        uint256 deployerPrivateKey = vm.envUint("CELO_PRIVATE_KEY");
        address celoLzEndpoint = vm.envAddress("CELO_LZ_ENDPOINT");
        uint16 polygonChainId = uint16(vm.envUint("POLYGON_CHAIN_ID"));
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleAadhaarKYC aadhaarKYC = new SimpleAadhaarKYC(
            celoLzEndpoint,
            polygonChainId,
            kycCheckerAddress
        );
        
        // Fund with CELO for LayerZero fees
        if (address(this).balance >= 0.01 ether) {
            payable(address(aadhaarKYC)).transfer(0.01 ether);
            console.log("Funded with 0.01 CELO for LayerZero fees");
        }
        
        vm.stopBroadcast();
        
        console.log("SimpleAadhaarKYC deployed to:", address(aadhaarKYC));
        return address(aadhaarKYC);
    }
    
    function run() external {
        console.log("=== COMPLETE BRIDGE DEPLOYMENT ===");
        console.log("This script will guide you through the deployment process");
        console.log("");
        console.log("Step 1: Deploy KYCChecker on Polygon first");
        console.log("Step 2: Deploy AadhaarKYC on Celo with KYCChecker address");
        console.log("Step 3: Configure trusted remotes");
        console.log("");
        console.log("Run the following commands:");
        console.log("1. forge script script/DeployCompleteBridge.s.sol:DeployCompleteBridge --sig 'deployKYCChecker()' --rpc-url $POLYGON_RPC_URL --broadcast --verify");
        console.log("2. Copy the KYCChecker address and update your .env file");
        console.log("3. forge script script/DeployCompleteBridge.s.sol:DeployCompleteBridge --sig 'deployAadhaarKYC(address)' <KYC_CHECKER_ADDRESS> --rpc-url $CELO_RPC_URL --broadcast");
    }
}