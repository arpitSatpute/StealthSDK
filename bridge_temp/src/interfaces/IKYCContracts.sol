// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IKYCChecker {
    function checkKYC(address user) external view returns (bool isVerified, string memory kycUrl, string memory qrCodeUrl);
    function isKYCVerified(address user) external view returns (bool);
}

interface ISelfProtocolKYC {
    function isKYCVerified(address user) external view returns (bool);
    function verificationConfigId() external view returns (bytes32);
    function estimateFees(address user) external view returns (uint256 nativeFee, uint256 zroFee);
}

interface IAadhaarKYCSimple {
    function checkKYCWithReceiver(address user, address kycChecker) 
        external view returns (bool isVerified, string memory kycUrl, string memory qrCodeUrl);
}