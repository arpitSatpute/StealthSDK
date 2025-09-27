// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "../../../lib/openzeppelin-contracts/lib/forge-std/src/Script.sol";
import "../src/SimpleKYCChecker.sol";

contract ConfigureTrustedRemotes is Script {
    
    function setTrustedRemoteOnKYCChecker(address kycCheckerAddress, address aadhaarKYCAddress) public {
        console.log("=== CONFIGURING TRUSTED REMOTE ON KYC CHECKER ===");
        
        uint256 deployerPrivateKey = vm.envUint("POLYGON_PRIVATE_KEY");
        uint16 celoChainId = uint16(vm.envUint("CELO_CHAIN_ID"));
        
        vm.startBroadcast(deployerPrivateKey);
        
        SimpleKYCChecker kycChecker = SimpleKYCChecker(kycCheckerAddress);
        
        // Set trusted remote to the AadhaarKYC contract on Celo
        bytes memory trustedRemote = abi.encodePacked(aadhaarKYCAddress);
        kycChecker.setTrustedRemote(celoChainId, trustedRemote);
        
        vm.stopBroadcast();
        
        console.log("Trusted remote set on KYCChecker");
        console.log("KYCChecker:", kycCheckerAddress);
        console.log("Trusted AadhaarKYC:", aadhaarKYCAddress);
        console.log("Chain ID:", celoChainId);
    }
    
    function run() external {
        console.log("=== TRUSTED REMOTE CONFIGURATION ===");
        console.log("");
        console.log("This script configures trusted remotes for LayerZero communication");
        console.log("");
        console.log("Usage:");
        console.log("forge script script/ConfigureTrustedRemotes.s.sol:ConfigureTrustedRemotes \\");
        console.log("  --sig 'setTrustedRemoteOnKYCChecker(address,address)' \\");
        console.log("  <KYC_CHECKER_ADDRESS> <AADHAAR_KYC_ADDRESS> \\");
        console.log("  --rpc-url $POLYGON_RPC_URL --broadcast");
        console.log("");
        console.log("Note: The AadhaarKYC contract doesn't need trusted remote setup");
        console.log("as it uses LayerZero's send() function directly.");
    }
}