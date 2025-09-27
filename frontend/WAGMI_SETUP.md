# 🚀 Quick Setup Guide - Wagmi KYC Tester

## 📦 Installation

```bash
# Navigate to the frontend directory
cd /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/frontend/StealthSDk

# Install all required dependencies
npm install wagmi viem @tanstack/react-query connectkit react-hot-toast

# Start the development server
npm run dev
```

## 🔗 Access the KYC Tester

Open your browser and navigate to: **http://localhost:5173/kyc-test**

## ✨ Features

### 🔌 Multi-Wallet Support
- **ConnectKit Integration**: Support for 10+ wallets
- **MetaMask**, **WalletConnect**, **Coinbase Wallet**, etc.
- **One-click connection** with beautiful UI

### ⛓️ Multi-Chain Support
- **Celo Sepolia Testnet** (Chain ID: 11142220)
- **Polygon Amoy Testnet** (Chain ID: 80002)
- **Automatic network switching**
- **Custom RPC endpoints**

### 📊 Real-time Contract Interaction
- **Live KYC status** updates
- **Cross-chain verification** tracking
- **Transaction status** monitoring
- **Gas estimation** and optimization

### 🎯 Smart Contract Integration
- **SimpleAadhaarKYC** on Celo: `0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159`
- **SimpleKYCChecker** on Polygon: `0x9ED71781F2C175EDb569E9ecE1d739F716063c51`
- **LayerZero messaging** between chains

## 🧪 Testing Workflow

1. **Connect Wallet** → Click the connect button and choose your wallet
2. **Switch to Celo** → Use the network switch button
3. **Enter Test Address** → Your wallet address is auto-filled
4. **Check Initial Status** → Both chains should show "❌ Not Verified"
5. **Simulate KYC** → Click "Simulate KYC Verification" on Celo
6. **Wait for Cross-chain** → LayerZero processes the message (30-60s)
7. **Verify Update** → Polygon should now show "✅ Verified"

## 🛠️ Tech Stack

- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **ConnectKit** - Beautiful wallet connection UI
- **TanStack Query** - Powerful data synchronization
- **React Hot Toast** - Elegant notifications

## 🚨 Important Notes

- **Testnet Only** - Never use mainnet or real funds
- **Faucet Tokens Required** - Get test tokens from official faucets
- **LayerZero Delays** - Cross-chain messages take 30-60 seconds
- **Network Switching** - Wagmi handles network changes automatically

## 🔧 Configuration

The app is pre-configured with:
- ✅ Custom chain definitions for both testnets
- ✅ Proper RPC endpoints with Alchemy
- ✅ Contract addresses and ABIs
- ✅ LayerZero chain ID mappings

No additional configuration needed - just install and run!

---

**Ready to test cross-chain KYC verification? Run the installation command above! 🎉**