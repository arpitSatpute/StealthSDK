// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "solidity-examples/lzApp/interfaces/ILayerZeroReceiver.sol";
import "solidity-examples/lzApp/interfaces/ILayerZeroEndpoint.sol";

contract KYCChecker is ILayerZeroReceiver {
    mapping(address => bool) public isKYCVerified;
    
    ILayerZeroEndpoint public immutable lzEndpoint;
    address public owner;
    mapping(uint16 => bytes) public trustedRemoteLookup;

    address private immutable i_celoSender; // Address of AadhaarKYC on Celo Alfajores
    uint16 private immutable i_celoChainId; // Celo Alfajores LayerZero Chain ID: 10132

    event KYCStatusUpdated(address indexed user);
    event KYCRequired(address indexed user, string kycUrl, string qrCodeUrl);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _lzEndpoint, // LayerZero Endpoint on Polygon Amoy: 0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0
        address celoSender, // Address of AadhaarKYC on Celo Alfajores
        uint16 celoChainId  // Celo Alfajores Chain ID: 10132
    ) {
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        owner = msg.sender;
        i_celoSender = celoSender;
        i_celoChainId = celoChainId;
    }

    function lzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) external override {
        require(msg.sender == address(lzEndpoint), "Only endpoint");
        require(_srcChainId == i_celoChainId, "Invalid source chain");
        
        // Decode source address
        address srcAddress;
        assembly {
            srcAddress := mload(add(_srcAddress, 20))
        }
        require(srcAddress == i_celoSender, "Invalid sender");

        // Decode user address from payload
        address user = abi.decode(_payload, (address));
        isKYCVerified[user] = true;
        
        emit KYCStatusUpdated(user);
    }

    function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress) external onlyOwner {
        trustedRemoteLookup[_srcChainId] = _srcAddress;
    }

    // Function to check KYC status and redirect if not verified
    function checkKYC(address user) external view returns (bool isVerified, string memory kycUrl, string memory qrCodeUrl) {
        if (isKYCVerified[user]) {
            return (true, "", "");
        } else {
            // Self Protocol URLs for KYC page and QR code
            kycUrl = "https://kyc.self.xyz/aadhaar";
            qrCodeUrl = "https://kyc.self.xyz/aadhaar/qr";
            return (false, kycUrl, qrCodeUrl);
        }
    }

    // For integration with other contracts
    modifier onlyKYCd() {
        require(isKYCVerified[msg.sender], "KYC not verified");
        _;
    }
}