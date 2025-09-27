# Cross-Chain KYC Bridge Tester

This frontend application allows you to test the deployed cross-chain KYC verification contracts using LayerZero.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/frontend/StealthSDk
npm install wagmi viem @tanstack/react-query connectkit react-hot-toast
```

Or run the installation script:
```bash
bash /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/frontend/install-kyc-deps.sh
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access KYC Tester
Open your browser and navigate to: **http://localhost:5173/kyc-test**

## 📋 Deployed Contracts

### Celo Sepolia Testnet
- **Contract**: SimpleAadhaarKYC
- **Address**: `0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159`
- **Chain ID**: 11142220
- **LayerZero Chain ID**: 10132

### Polygon Amoy Testnet
- **Contract**: SimpleKYCChecker  
- **Address**: `0x9ED71781F2C175EDb569E9ecE1d739F716063c51`
- **Chain ID**: 80002
- **LayerZero Chain ID**: 10160

## 🧪 How to Test

### Prerequisites
1. **Web3 Wallet** (MetaMask, WalletConnect, etc.)
2. **Test tokens** on both networks:
   - Celo Sepolia: Get CELO from [Celo Faucet](https://faucet.celo.org/)
   - Polygon Amoy: Get POL from [Polygon Faucet](https://faucet.polygon.technology/)

### Testing Steps

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection

2. **Switch Networks**
   - Use the network switch buttons to add/switch between:
     - Celo Sepolia Testnet
     - Polygon Amoy Testnet

3. **Check Initial KYC Status**
   - Enter an address to test (or use your connected wallet address)
   - Click "Check KYC Status"
   - Both networks should show "❌ Not Verified"

4. **Simulate KYC Verification**
   - Switch to **Celo Sepolia** network
   - Click "Simulate KYC Verification"
   - This will:
     - Mark the address as KYC verified on Celo
     - Send a cross-chain message via LayerZero to Polygon
     - Update the KYC status on Polygon

5. **Verify Cross-Chain Communication**
   - Wait 30-60 seconds for LayerZero message processing
   - Click "Check KYC Status" again
   - Celo should show "✅ Verified"
   - Polygon should show "✅ Verified" (if cross-chain message succeeded)

## 🔧 Features

### Wallet Integration
- **Multi-wallet support** via ConnectKit (MetaMask, WalletConnect, Coinbase, etc.)
- **Network Detection** and display
- **Automatic Network Switching** with Wagmi

### Multi-Chain Support
- **Celo Sepolia** testnet integration
- **Polygon Amoy** testnet integration
- **Network-specific** contract interactions

### KYC Status Monitoring
- **Real-time status** checking on both chains
- **Cross-chain verification** tracking
- **KYC URL display** for unverified users

### LayerZero Integration
- **Cross-chain messaging** simulation
- **Message status tracking**
- **Gas estimation** and transaction monitoring

## 🔍 Contract Functions Tested

### SimpleAadhaarKYC (Celo)
- `mockSelfProtocolCallback(address)` - Simulates KYC verification
- `isKYCVerified(address)` - Checks local KYC status
- Cross-chain message sending via LayerZero

### SimpleKYCChecker (Polygon)
- `checkKYC(address)` - Returns verification status and URLs
- `isKYCVerified(address)` - Checks received KYC status
- LayerZero message receiving

## 🐛 Troubleshooting

### Common Issues

1. **"Please install MetaMask"**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Failed to switch network"**
   - Manually add the networks in MetaMask:
     - **Celo Sepolia**: RPC `https://celo-sepolia.g.alchemy.com/v2/Tz5b8XWL2oTDtmfPsdXPx`
     - **Polygon Amoy**: RPC `https://polygon-amoy.g.alchemy.com/v2/7NX8baKoW_-wNuAxpgZnk`

3. **"Insufficient funds for gas"**
   - Get test tokens from faucets:
     - [Celo Faucet](https://faucet.celo.org/)
     - [Polygon Faucet](https://faucet.polygon.technology/)

4. **"Cross-chain message not received"**
   - LayerZero messages can take 1-2 minutes
   - Check LayerZero Scan for message status
   - Ensure trusted remotes are configured (advanced)

### Debug Information
- **Contract addresses** are displayed in the interface
- **Transaction hashes** are shown in browser console
- **Error messages** appear as toast notifications

## 🔗 Useful Links

- [LayerZero Documentation](https://layerzero.gitbook.io/)
- [Self Protocol Documentation](https://docs.self.xyz/)
- [Celo Developer Docs](https://docs.celo.org/)
- [Polygon Developer Docs](https://wiki.polygon.technology/)

## 📝 Technical Notes

### Architecture
- **React 18** with TypeScript
- **Wagmi v2** for Web3 interactions
- **Viem** for Ethereum interactions
- **ConnectKit** for wallet connections
- **TanStack Query** for state management
- **TailwindCSS** for styling
- **HeroUI** components
- **React Hot Toast** for notifications

### Security Considerations
- This is a **testnet-only** implementation
- Private keys are handled by MetaMask
- Contract addresses are hardcoded for testing

### Limitations
- **Testnet only** - not for production use
- **Simplified KYC** - no actual Self Protocol integration
- **Manual network switching** required
- **No trusted remote configuration** in UI (requires manual setup)

---

## 🚨 Important Security Notice

This application is for **testing purposes only** on testnets. Never use real private keys or mainnet tokens. Always verify contract addresses before interacting with them.