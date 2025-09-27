// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Script, console } from "forge-std/Script.sol";
import { AadhaarKYC } from "../src/AadhaarKYC.sol";

contract DeployCelo is Script {
    function run() external {
        // Get deployment parameters from environment variables
        address identityVerificationHubV2Address = vm.envAddress("IDENTITY_VERIFICATION_HUB_V2_ADDRESS");
        uint256 scopeSeed = vm.envUint("SCOPE_SEED");
        
        console.log("Deploying AadhaarKYC contract to Celo Sepolia...");
        console.log("Identity Verification Hub V2 address:", identityVerificationHubV2Address);
        console.log("Scope Seed:", scopeSeed);
        console.log("Deployer address:", msg.sender);
        
        // Get network info
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        
        vm.startBroadcast();
        
        // Deploy the AadhaarKYC contract
        AadhaarKYC aadhaarKYC = new AadhaarKYC(
            identityVerificationHubV2Address,
            scopeSeed
        );
        
        vm.stopBroadcast();
        
        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("AadhaarKYC contract deployed at:", address(aadhaarKYC));
        console.log("Verification Config ID:");
        console.logBytes32(aadhaarKYC.verificationConfigId());
        
        // Verification information
        console.log("\n=== CONTRACT VERIFICATION ===");
        console.log("Contract Address:", address(aadhaarKYC));
        console.log("Network: Celo Sepolia (Chain ID: 44787)");
        console.log("Constructor Args:");
        console.log("  - identityVerificationHubV2Address:", identityVerificationHubV2Address);
        console.log("  - scopeSeed:", scopeSeed);
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Save the contract address:", address(aadhaarKYC));
        console.log("2. Verify contract on Celoscan");
        console.log("3. Test KYC verification functionality");
        console.log("4. Update frontend with new contract address");
        
        // Save deployment info to a file
        string memory deploymentInfo = string(abi.encodePacked(
            "AadhaarKYC Contract Deployment\n",
            "Network: Celo Sepolia\n",
            "Chain ID: ", vm.toString(block.chainid), "\n",
            "Contract Address: ", vm.toString(address(aadhaarKYC)), "\n",
            "Identity Hub Address: ", vm.toString(identityVerificationHubV2Address), "\n",
            "Scope Seed: ", vm.toString(scopeSeed), "\n",
            "Deployer: ", vm.toString(msg.sender), "\n",
            "Block Number: ", vm.toString(block.number), "\n"
        ));
        
        vm.writeFile("./deployment-info.txt", deploymentInfo);
        console.log("\nDeployment info saved to: ./deployment-info.txt");
    }
}