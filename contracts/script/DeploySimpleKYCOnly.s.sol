// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../src/bridge/src/SimpleKYCChecker.sol";

contract DeploySimpleKYCOnly is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        address lzEndpoint = vm.envAddress("POLYGON_LZ_ENDPOINT");
        uint16 celoChainId = uint16(vm.envUint("CELO_CHAIN_ID"));
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleKYCChecker kycChecker = new SimpleKYCChecker(
            lzEndpoint,
            address(0), // celoSender will be set later
            celoChainId
        );
        
        vm.stopBroadcast();
        
        console.log("SimpleKYCChecker deployed to:", address(kycChecker));
    }
}