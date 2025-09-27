# StealthSDK KYC Bridge

A cross-chain KYC verification system that enables Aadhaar-based identity verification on Celo Alfajores with automatic synchronization to Polygon Amoy using LayerZero protocol and Self Protocol's zkKYC technology.

## Architecture Overview

```
┌─────────────────┐         LayerZero          ┌─────────────────┐
│  Celo Alfajores │ ◄─────────────────────────► │  Polygon Amoy   │
│                 │                             │                 │
│  AadhaarKYC.sol │                             │ KYCChecker.sol  │
│  ┌─────────────┐│                             │ ┌─────────────┐ │
│  │Self Protocol││                             │ │   LayerZero │ │
│  │   zkKYC     ││                             │ │  Receiver   │ │
│  └─────────────┘│                             │ └─────────────┘ │
└─────────────────┘                             └─────────────────┘
```

## Features

- **Self Protocol Integration**: Aadhaar-based zkKYC verification with privacy preservation
- **Cross-chain Synchronization**: Automatic KYC status sync via LayerZero V1
- **QR Code Support**: Mobile-friendly verification flow with QR codes
- **Frontend Interface**: Modern Wagmi-based React app with ConnectKit wallet integration
- **Multi-chain Support**: Seamless switching between Celo and Polygon networks

## Smart Contracts

### AadhaarKYC.sol (Celo Alfajores)
- **Address**: `0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159`
- **Purpose**: Self Protocol integration for Aadhaar KYC verification
- **Features**:
  - Inherits from Self Protocol's `SelfVerificationRoot`
  - Custom verification hook for KYC processing
  - LayerZero cross-chain messaging
  - Fee estimation for KYC requests
  - QR code generation for mobile verification

### KYCChecker.sol (Polygon Amoy)
- **Address**: `0x9ED71781F2C175EDb569E9ecE1d739F716063c51`
- **Purpose**: LayerZero message receiver for KYC status updates
- **Features**:
  - Receives cross-chain KYC status from Celo
  - Validates message authenticity
  - Provides KYC status lookup
  - Returns Self Protocol URLs for verification

## Getting Started

### Prerequisites

- Node.js 18+
- Foundry
- MetaMask or compatible wallet
- Test tokens on Celo Alfajores and Polygon Amoy

### Contract Deployment

1. **Setup Environment**:
   ```bash
   cp .env.template .env
   # Fill in your private keys and RPC URLs
   ```

2. **Deploy AadhaarKYC on Celo Alfajores**:
   ```bash
   forge script script/DeployFullKYCBridge.s.sol:DeployFullKYCBridge --rpc-url $CELO_RPC_URL --broadcast --verify
   ```

3. **Deploy KYCChecker on Polygon Amoy**:
   ```bash
   # Update CELO_AADHAAR_KYC_ADDRESS in .env with deployed address
   forge script script/DeployFullKYCBridge.s.sol:DeployKYCCheckerPolygon --rpc-url $POLYGON_RPC_URL --broadcast --verify
   ```

4. **Configure Cross-chain Communication**:
   ```bash
   # Set receiver address on AadhaarKYC contract
   cast send $CELO_AADHAAR_KYC_ADDRESS "setReceiver(address)" $POLYGON_KYC_CHECKER_ADDRESS --rpc-url $CELO_RPC_URL --private-key $CELO_PRIVATE_KEY
   ```

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   # Create .env file with:
   REACT_APP_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Usage Flow

### 1. KYC Verification Process

1. **Connect Wallet**: Use ConnectKit to connect your wallet
2. **Switch to Celo**: Ensure you're on Celo Alfajores network
3. **Request KYC**: Click "Request KYC Verification" button
4. **Complete Aadhaar Verification**:
   - Use QR code for mobile verification, or
   - Click direct link to Self Protocol verification page
5. **Wait for Confirmation**: System polls for verification completion
6. **Cross-chain Sync**: KYC status automatically syncs to Polygon

### 2. Check KYC Status

- **On Celo**: View your Self Protocol verification status
- **On Polygon**: Check synced KYC status from LayerZero bridge

## Technical Details

### LayerZero Configuration
- **Celo Chain ID**: 10132
- **Polygon Chain ID**: 10160
- **Endpoint**: `0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0`

### Self Protocol Integration
- **Hub Address**: `0x68c931C9a534D37aa78094877F46fE46a49F1A51` (Celo Alfajores)
- **Verification Type**: Aadhaar-based zkKYC
- **Privacy**: Zero-knowledge proofs ensure data privacy

### Frontend Stack
- **Wagmi V2**: Type-safe React hooks for Ethereum
- **ConnectKit**: Multi-wallet connection with beautiful UI
- **React QR Code**: QR code generation for mobile verification
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons

## Security Considerations

- **Message Authentication**: LayerZero messages validated by source contract
- **Access Control**: Only authorized contracts can update KYC status
- **Privacy Protection**: Self Protocol ensures Aadhaar data privacy
- **Cross-chain Security**: LayerZero provides secure cross-chain messaging

## Contract Interfaces

```solidity
interface IKYCChecker {
    function checkKYC(address user) external view returns (
        bool isVerified,
        string memory kycUrl,
        string memory qrCodeUrl
    );
}

interface ISelfProtocolKYC {
    function requestKYC(address user) external payable;
    function estimateKYCFees(address user) external view returns (uint256 fee);
    function verificationConfigId() external view returns (uint64);
}
```

## Development

### Testing
```bash
forge test
```

### Build
```bash
forge build
```

### Deploy to Testnet
```bash
forge script script/DeployFullKYCBridge.s.sol --rpc-url <RPC_URL> --broadcast
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ for ETH Global hackathon using Self Protocol, LayerZero, and modern Web3 stack.