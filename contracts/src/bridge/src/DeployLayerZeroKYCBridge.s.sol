// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Script.sol";
import "../src/AadhaarKYC.sol";
import "../src/KYCChecker.sol";

contract DeployLayerZeroKYCBridge is Script {
    // LayerZero Endpoint Addresses (Verify these from LayerZero documentation)
    address constant CELO_LZ_ENDPOINT = 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0;
    address constant POLYGON_LZ_ENDPOINT = 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0;
    
    // LayerZero Chain IDs
    uint16 constant CELO_ALFAJORES_CHAIN_ID = 10132;
    uint16 constant POLYGON_AMOY_CHAIN_ID = 10160;
    
    function deployCelo() external returns (address) {
        // Self Protocol configuration - REPLACE WITH ACTUAL VALUES
        address SELF_PROTOCOL_HUB = 0x0000000000000000000000000000000000000000; // TODO: Replace
        uint256 SCOPE_SEED = 12345; // TODO: Replace
        
        // Note: This will initially use zero address for receiver, update after Polygon deployment
        address INITIAL_RECEIVER = address(0);
        
        vm.startBroadcast();
        
        AadhaarKYC aadhaarKYC = new AadhaarKYC(
            SELF_PROTOCOL_HUB,
            SCOPE_SEED,
            CELO_LZ_ENDPOINT,
            POLYGON_AMOY_CHAIN_ID,
            INITIAL_RECEIVER
        );
        
        vm.stopBroadcast();
        
        console.log("=== CELO DEPLOYMENT ===");
        console.log("AadhaarKYC deployed to:", address(aadhaarKYC));
        
        return address(aadhaarKYC);
    }
    
    function deployPolygon(address aadhaarKYCAddress) external returns (address) {
        vm.startBroadcast();
        
        KYCChecker kycChecker = new KYCChecker(
            POLYGON_LZ_ENDPOINT,
            aadhaarKYCAddress,
            CELO_ALFAJORES_CHAIN_ID
        );
        
        vm.stopBroadcast();
        
        console.log("=== POLYGON DEPLOYMENT ===");
        console.log("KYCChecker deployed to:", address(kycChecker));
        
        return address(kycChecker);
    }
    
    function configureTrustedRemotes(address aadhaarKYC, address kycChecker) external {
        console.log("=== CONFIGURATION STEPS ===");
        console.log("1. On Celo AadhaarKYC contract, call:");
        console.log("   setTrustedRemote(10160, abi.encodePacked(", kycChecker, "))");
        console.log("");
        console.log("2. On Polygon KYCChecker contract, call:");
        console.log("   setTrustedRemote(10132, abi.encodePacked(", aadhaarKYC, "))");
        console.log("");
        console.log("3. Fund AadhaarKYC contract with CELO for LayerZero fees");
        console.log("");
        console.log("4. Update Self Protocol URLs in KYCChecker.checkKYC() function");
    }
    
    function run() external {
        console.log("=== LayerZero Cross-Chain KYC Bridge Deployment ===");
        console.log("");
        console.log("IMPORTANT: Update the following before deployment:");
        console.log("- SELF_PROTOCOL_HUB address in deployCelo()");
        console.log("- SCOPE_SEED value in deployCelo()");
        console.log("- Verify LayerZero endpoint addresses are current");
        console.log("");
        
        // For manual deployment, call deployCelo() first, then deployPolygon() with the result
        console.log("To deploy:");
        console.log("1. forge script script/DeployLayerZeroKYCBridge.s.sol:DeployLayerZeroKYCBridge --sig 'deployCelo()' --rpc-url <celo-rpc> --broadcast");
        console.log("2. forge script script/DeployLayerZeroKYCBridge.s.sol:DeployLayerZeroKYCBridge --sig 'deployPolygon(address)' <aadhaar-kyc-address> --rpc-url <polygon-rpc> --broadcast");
        console.log("3. Configure trusted remotes on both contracts");
    }
}