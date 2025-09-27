// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "solidity-examples/lzApp/interfaces/ILayerZeroEndpoint.sol";

// Simplified version without Self Protocol for now - can be enhanced later
contract SimpleAadhaarKYC {
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
        address _lzEndpoint, // LayerZero Endpoint on Celo Alfajores
        uint16 dstChainId, // Polygon Amoy Chain ID: 10160
        address receiver   // Address of KYCChecker contract on Polygon Amoy
    ) {
        lzEndpoint = ILayerZeroEndpoint(_lzEndpoint);
        owner = msg.sender;
        i_dstChainId = dstChainId;
        i_receiver = receiver;
    }

    // Function to verify KYC (for testing - replace with Self Protocol integration)
    function verifyKYC(address user) external onlyOwner {
        isKYCVerified[user] = true;
        emit KYCVerified(user);
        
        // Send cross-chain message
        _sendKYCUpdate(user);
    }

    // Mock function to simulate Self Protocol callback
    function mockSelfProtocolCallback(address user) external {
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