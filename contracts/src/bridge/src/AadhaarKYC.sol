// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";
import "solidity-examples/lzApp/interfaces/ILayerZeroEndpoint.sol";

contract AadhaarKYC is SelfVerificationRoot {
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    mapping(address => bool) public isKYCVerified;

    ILayerZeroEndpoint public immutable lzEndpoint;
    address public owner;

    uint16 private immutable i_dstChainId; // Polygon Amoy LayerZero Chain ID: 10160
    address private i_receiver;  // Address of KYCChecker contract on Polygon Amoy

    event KYCVerified(address indexed user);
    event MessageSent(address indexed user, uint16 dstChainId, bytes dstAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address identityVerificationHubV2Address, // Self Protocol Hub on Celo Alfajores: 0x68c931C9a534D37aa78094877F46fE46a49F1A51
        uint256 scopeSeed,
        address _lzEndpoint, // LayerZero Endpoint on Celo Alfajores: 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0
        uint16 dstChainId, // Polygon Amoy Chain ID: 10160
        address receiver   // Address of KYCChecker contract on Polygon Amoy
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        owner = msg.sender;
        i_dstChainId = dstChainId;
        i_receiver = receiver;

        string[] memory forbiddenCountries = new string[](0); // None
        SelfUtils.UnformattedVerificationConfigV2 memory rawCfg = SelfUtils.UnformattedVerificationConfigV2({
            olderThan: 18,
            forbiddenCountries: forbiddenCountries,
            ofacEnabled: false
        });

        verificationConfig = SelfUtils.formatVerificationConfigV2(rawCfg);
        verificationConfigId = IIdentityVerificationHubV2(identityVerificationHubV2Address).setVerificationConfigV2(verificationConfig);
    }

    function customVerificationHook(
        ISelfVerificationRoot.GenericDiscloseOutputV2 memory output,
        bytes memory userData
    ) internal override {
        address user = abi.decode(userData, (address)); // Decode user address from frontend
        isKYCVerified[user] = true;
        emit KYCVerified(user);

        // Send cross-chain message
        _sendKYCUpdate(user);
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    // Mock function to simulate Self Protocol callback (for testing)
    function mockSelfProtocolCallback(address user) external onlyOwner {
        isKYCVerified[user] = true;
        emit KYCVerified(user);

        // Send cross-chain message
        _sendKYCUpdate(user);
    }

    function _sendKYCUpdate(address user) internal {
        // Prepare payload for cross-chain message
        bytes memory payload = abi.encode(user);

        // LayerZero message parameters
        bytes memory adapterParams = abi.encodePacked(uint16(1), uint256(200_000)); // Version 1, gasLimit
        bytes memory dstAddress = abi.encodePacked(i_receiver);

        // Estimate fees
        (uint256 nativeFee, ) = lzEndpoint.estimateFees(i_dstChainId, address(this), payload, false, adapterParams);

        // Send message via LayerZero
        lzEndpoint.send{value: nativeFee}(
            i_dstChainId,
            dstAddress,
            payload,
            payable(address(this)), // Refund address
            address(0), // ZRO payment address (not used)
            adapterParams
        );

        emit MessageSent(user, i_dstChainId, dstAddress);
    }

    // Function to update receiver address
    function setReceiver(address receiver) external onlyOwner {
        i_receiver = receiver;
    }

    // Function to estimate fees
    function estimateFees(address user) external view returns (uint256 nativeFee, uint256 zroFee) {
        bytes memory payload = abi.encode(user);
        bytes memory adapterParams = abi.encodePacked(uint16(1), uint256(200_000));
        return lzEndpoint.estimateFees(i_dstChainId, address(this), payload, false, adapterParams);
    }

    // For integration with other contracts
    modifier onlyKYCd() {
        require(isKYCVerified[msg.sender], "KYC not verified");
        _;
    }

    // Allow funding the contract for LayerZero fees
    receive() external payable {}

    // Function to withdraw excess funds
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
}