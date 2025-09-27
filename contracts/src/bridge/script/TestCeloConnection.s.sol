// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Script, console } from "forge-std/Script.sol";

contract TestCeloConnection is Script {
    function run() external view {
        console.log("=== CELO SEPOLIA CONNECTION TEST ===");
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Block Timestamp:", block.timestamp);
        console.log("Block Hash:", vm.toString(blockhash(block.number - 1)));
        
        // Expected values for Celo Sepolia
        console.log("\n=== EXPECTED VALUES ===");
        console.log("Expected Chain ID: 44787");
        
        if (block.chainid == 44787) {
            console.log("Connected to Celo Sepolia!");
        } else {
            console.log("Not connected to Celo Sepolia");
        }
        
        console.log("\n=== GAS INFORMATION ===");
        console.log("Base Fee:", block.basefee);
        console.log("Gas Limit:", block.gaslimit);
    }
}