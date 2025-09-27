// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {SelfStructs} from "@selfxyz/contracts/contracts/libraries/SelfStructs.sol";
import {SelfUtils} from "@selfxyz/contracts/contracts/libraries/SelfUtils.sol";
import {IIdentityVerificationHubV2} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV2.sol";

contract AadhaarKYC is SelfVerificationRoot {
    SelfStructs.VerificationConfigV2 public verificationConfig;
    bytes32 public verificationConfigId;

    mapping(address => bool) public isKYCVerified;

    event KYCVerified(address indexed user);

    constructor(
        address identityVerificationHubV2Address,
        uint256 scopeSeed
    ) SelfVerificationRoot(identityVerificationHubV2Address, scopeSeed) {
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
    }

    function getConfigId(
        bytes32 /* destinationChainId */,
        bytes32 /* userIdentifier */,
        bytes memory /* userDefinedData */
    ) public view override returns (bytes32) {
        return verificationConfigId;
    }

    // For integration with other contracts
    modifier onlyKYCd() {
        require(isKYCVerified[msg.sender], "KYC not verified");
        _;
    }
}