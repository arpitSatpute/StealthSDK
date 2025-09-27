// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/bridge/src/SimpleAadhaarKYC.sol";

contract DeploySimpleAadhaarKYC is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("CELO_PRIVATE_KEY");
        address lzEndpoint = vm.envAddress("CELO_LZ_ENDPOINT");
        uint16 polygonChainId = uint16(vm.envUint("POLYGON_CHAIN_ID"));
        
        // Use the deployed SimpleKYCChecker address
        address polygonKYCChecker = 0x9ED71781F2C175EDb569E9ecE1d739F716063c51;
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleAadhaarKYC aadhaarKYC = new SimpleAadhaarKYC(
            lzEndpoint,
            polygonChainId,
            polygonKYCChecker
        );
        
        vm.stopBroadcast();
        
        console.log("SimpleAadhaarKYC deployed to:", address(aadhaarKYC));
        console.log("Connected to SimpleKYCChecker at:", polygonKYCChecker);
    }
}