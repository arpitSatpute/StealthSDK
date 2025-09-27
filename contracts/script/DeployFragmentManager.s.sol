// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/core/FragmentManager.sol";

contract DeployFragmentManagerScript is Script {
    // Existing deployed addresses
    address constant PYUSD_TOKEN_ADDRESS = 0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1;
    address constant POOL_A_ADDRESS = 0x821E700b376F12c14b6878Db70Df6e07B01E5792; // Pool #1
    address constant POOL_B_ADDRESS = 0x0fd4286E85fe448c12B79815E0B4123Cd086F63E; // Pool #2
    address constant POOL_C_ADDRESS = 0x8E3168aFECe8912b5ddA4A52dc2fF6E03B1E4d4F; // Pool #3
    address constant POOL_D_ADDRESS = 0xcbEd44AB6621A77d9f0927925BD7D9B74EF2Fe20; // Pool #4
    
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== Deploying FragmentManager Contract ===");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("PyUSD Token:", PYUSD_TOKEN_ADDRESS);
        console.log("Pool A:", POOL_A_ADDRESS);
        console.log("Pool B:", POOL_B_ADDRESS);
        console.log("Pool C:", POOL_C_ADDRESS);
        console.log("Pool D:", POOL_D_ADDRESS);
        
        // Deploy FragmentManager with all pool addresses
        FragmentManager fragmentManager = new FragmentManager(
            PYUSD_TOKEN_ADDRESS,
            POOL_A_ADDRESS,
            POOL_B_ADDRESS,
            POOL_C_ADDRESS,
            POOL_D_ADDRESS
        );
        
        console.log("\n=== FragmentManager Deployed ===");
        console.log("FragmentManager Address:", address(fragmentManager));
        console.log("Token Address:", address(fragmentManager.token()));
        console.log("Pool A Address:", fragmentManager.poolA());
        console.log("Pool B Address:", fragmentManager.poolB());
        console.log("Pool C Address:", fragmentManager.poolC());
        console.log("Pool D Address:", fragmentManager.poolD());
        console.log("Owner:", fragmentManager.owner());
        
        vm.stopBroadcast();
        
        console.log("\n=== Complete StealthSDK Deployment Summary ===");
        console.log("PyUSD Token:", PYUSD_TOKEN_ADDRESS);
        console.log("Pool Contract A:", POOL_A_ADDRESS);
        console.log("Pool Contract B:", POOL_B_ADDRESS);
        console.log("Pool Contract C:", POOL_C_ADDRESS);
        console.log("Pool Contract D:", POOL_D_ADDRESS);
        console.log("FragmentManager:", address(fragmentManager));
        
        console.log("\n=== Next Steps ===");
        console.log("1. Claim PyUSD tokens via airdrop");
        console.log("2. Approve FragmentManager to spend PyUSD");
        console.log("3. Test fragment deposit functionality");
        console.log("4. Test multi-level stealth transactions");
    }
}