// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "forge-std/Test.sol";
import "../src/KYCChecker.sol";
import "../src/interfaces/IKYCContracts.sol";

contract KYCBridgeTest is Test {
    KYCChecker public kycChecker;
    address public constant MOCK_LZ_ENDPOINT = address(0x1);
    address public constant MOCK_CELO_SENDER = address(0x2);
    uint16 public constant CELO_CHAIN_ID = 10132;
    
    function setUp() public {
        kycChecker = new KYCChecker(
            MOCK_LZ_ENDPOINT,
            MOCK_CELO_SENDER,
            CELO_CHAIN_ID
        );
    }
    
    function testKYCCheckerDeployment() public {
        assertEq(kycChecker.i_celoSender(), MOCK_CELO_SENDER);
        assertEq(kycChecker.i_celoChainId(), CELO_CHAIN_ID);
    }
    
    function testKYCStatusCheck() public {
        address testUser = address(0x123);
        
        // Initially user should not be verified
        (bool isVerified, string memory kycUrl, string memory qrCodeUrl) = kycChecker.checkKYC(testUser);
        assertFalse(isVerified);
        assertEq(kycUrl, "https://kyc.self.xyz/aadhaar");
        assertEq(qrCodeUrl, "https://kyc.self.xyz/aadhaar/qr");
        
        // After verification (would normally come from LayerZero message)
        // For testing, we'd need to mock the _nonblockingLzReceive call
        // This would require more complex setup with LayerZero mocks
    }
    
    function testOnlyKYCdModifier() public {
        address testUser = address(0x123);
        
        // This would test the modifier, but requires a contract that uses it
        // In practice, other contracts would import and use the KYCChecker
        assertFalse(kycChecker.isKYCVerified(testUser));
    }
}