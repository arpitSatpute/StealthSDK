// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "./interfaces/IKYCContracts.sol";

contract AadhaarKYCSimple {
    mapping(address => bool) public isKYCVerified;
    
    event KYCVerified(address indexed user);
    
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // Simplified KYC verification - in production this would be called by Self Protocol
    function verifyKYC(address user) external {
        require(msg.sender == owner, "Only owner can verify KYC");
        isKYCVerified[user] = true;
        emit KYCVerified(user);
    }
    
    // Mock function to simulate Self Protocol callback
    function mockSelfProtocolCallback(address user) external {
        isKYCVerified[user] = true;
        emit KYCVerified(user);
    }
    
    // Function to check KYC status using external KYCChecker contract
    function checkKYCWithReceiver(address user, address kycChecker) 
        external view returns (bool isVerified, string memory kycUrl, string memory qrCodeUrl) {
        IKYCChecker checker = IKYCChecker(kycChecker);
        return checker.checkKYC(user);
    }
    
    // For integration with other contracts
    modifier onlyKYCd() {
        require(isKYCVerified[msg.sender], "KYC not verified");
        _;
    }
}