// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/tokens/PyUSD.sol";

contract DeployPyUSDScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy PyUSD Token
        VUSDTToken pyusd = new VUSDTToken();
        
        console.log("=== PyUSD Deployment Successful ===");
        console.log("Contract Address:", address(pyusd));
        console.log("Token Name:", pyusd.name());
        console.log("Token Symbol:", pyusd.symbol());
        console.log("Owner:", pyusd.owner());
        console.log("Initial Supply:", pyusd.totalSupply());
        
        vm.stopBroadcast();
        
        console.log("\n=== Next Steps ===");
        console.log("1. Verify contract on PolygonScan");
        console.log("2. Test airdrop functionality");
        console.log("3. Add to frontend configuration");
    }
}