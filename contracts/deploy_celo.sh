#!/bin/bash

# Celo deployment script - run after deploying on Polygon

echo "🚀 Deploying AadhaarKYC on Celo Alfajores"
echo "========================================"

# Source environment variables
source .env

# Check if KYC_CHECKER_ADDRESS is set
if [ -z "$KYC_CHECKER_ADDRESS" ]; then
    echo "❌ KYC_CHECKER_ADDRESS not found in .env file!"
    echo "Please add the KYCChecker address from Polygon deployment"
    exit 1
fi

echo "Using KYCChecker address: $KYC_CHECKER_ADDRESS"
echo ""
echo "Deploying AadhaarKYC on Celo Alfajores..."

# Deploy AadhaarKYC on Celo
forge script src/bridge/script/DeploySimpleAadhaarKYC.s.sol:DeploySimpleAadhaarKYC \
  --rpc-url $CELO_RPC_URL \
  --broadcast

if [ $? -eq 0 ]; then
    echo "✅ AadhaarKYC deployed successfully on Celo Alfajores!"
    echo ""
    echo "📋 Please copy the AadhaarKYC address from the output above"
    echo ""
    echo "Step 3: Configure trusted remotes"
    echo "Replace <AADHAAR_KYC_ADDRESS> with the address from above:"
    echo ""
    echo "forge script src/bridge/script/ConfigureTrustedRemotes.s.sol:ConfigureTrustedRemotes \\"
    echo "  --sig 'setTrustedRemoteOnKYCChecker(address,address)' \\"
    echo "  $KYC_CHECKER_ADDRESS <AADHAAR_KYC_ADDRESS> \\"
    echo "  --rpc-url \$POLYGON_RPC_URL --broadcast"
else
    echo "❌ AadhaarKYC deployment failed!"
    exit 1
fi