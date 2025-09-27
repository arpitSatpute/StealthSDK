// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Script, console } from "forge-std/Script.sol";
import { AadhaarKYCSimple } from "../src/AadhaarKYCSimple.sol";

contract DeploySimple is Script {
    function run() external {
        console.log("Deploying AadhaarKYCSimple contract to Celo Sepolia...");
        console.log("Deployer address:", msg.sender);
        console.log("Chain ID:", block.chainid);
        console.log("Block number:", block.number);
        
        vm.startBroadcast();
        
        // Deploy the simplified AadhaarKYC contract
        AadhaarKYCSimple aadhaarKYC = new AadhaarKYCSimple();
        
        vm.stopBroadcast();
        
        console.log("=== DEPLOYMENT SUCCESSFUL ===");
        console.log("AadhaarKYCSimple contract deployed at:", address(aadhaarKYC));
        console.log("Owner:", aadhaarKYC.owner());
        
        console.log("\n=== CONTRACT VERIFICATION ===");
        console.log("Contract Address:", address(aadhaarKYC));
        console.log("Network: Celo Sepolia (Chain ID: 44787)");
        console.log("No constructor arguments needed");
        
        console.log("\n=== NEXT STEPS ===");
        console.log("1. Save the contract address:", address(aadhaarKYC));
        console.log("2. Update frontend/.env with REACT_APP_CONTRACT_ADDRESS");
        console.log("3. Update frontend ABI file");
        console.log("4. Test the simplified KYC flow");
        
        // Save deployment info to a file
        string memory deploymentInfo = string(abi.encodePacked(
            "AadhaarKYCSimple Contract Deployment\n",
            "Network: Celo Sepolia\n",
            "Chain ID: ", vm.toString(block.chainid), "\n",
            "Contract Address: ", vm.toString(address(aadhaarKYC)), "\n",
            "Owner: ", vm.toString(aadhaarKYC.owner()), "\n",
            "Deployer: ", vm.toString(msg.sender), "\n",
            "Block Number: ", vm.toString(block.number)
        ));
        
        vm.writeFile("./deployment-info-simple.txt", deploymentInfo);
        console.log("\nDeployment info saved to: ./deployment-info-simple.txt");
    }
}