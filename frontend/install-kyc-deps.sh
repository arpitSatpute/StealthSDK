#!/bin/bash

# Navigate to frontend directory
cd /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/frontend/StealthSDk

# Install required dependencies for KYC testing with Wagmi
echo "Installing Wagmi, ConnectKit, and other required dependencies..."
npm install wagmi viem @tanstack/react-query connectkit react-hot-toast

echo "Dependencies installed successfully!"
echo ""
echo "To start the development server:"
echo "cd /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/frontend/StealthSDk"
echo "npm run dev"
echo ""
echo "Navigate to http://localhost:5173/kyc-test to test the KYC contracts"
echo ""
echo "Features:"
echo "- 🔗 Connect wallet with ConnectKit"
echo "- 🔀 Switch between Celo Sepolia and Polygon Amoy"
echo "- ✅ Check KYC status on both chains"
echo "- 🚀 Simulate cross-chain KYC verification"