#!/bin/bash

# LayerZero Cross-Chain KYC Bridge Deployment Script
# Make sure to update your .env file first!

echo "🚀 LayerZero Cross-Chain KYC Bridge Deployment"
echo "=============================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please create one with your private keys and RPC URLs."
    exit 1
fi

# Source environment variables
source .env

# Check required variables
if [ -z "$POLYGON_PRIVATE_KEY" ] || [ -z "$CELO_PRIVATE_KEY" ]; then
    echo "❌ Missing private keys in .env file!"
    echo "Please add POLYGON_PRIVATE_KEY and CELO_PRIVATE_KEY"
    exit 1
fi

echo ""
echo "Step 1: Deploying KYCChecker on Polygon Amoy..."
echo "================================================"

# Deploy KYCChecker on Polygon
POLYGON_DEPLOY=$(forge script src/bridge/script/DeploySimpleKYCChecker.s.sol:DeploySimpleKYCChecker \
  --rpc-url $POLYGON_RPC_URL \
  --broadcast \
  --json 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ KYCChecker deployed successfully on Polygon Amoy!"
    # Extract address from output (you might need to adjust this based on actual output)
    echo "📋 Please copy the KYCChecker address from the output above"
    echo ""
    echo "Step 2: Please update your .env file with:"
    echo "KYC_CHECKER_ADDRESS=<address_from_above>"
    echo ""
    echo "Then run the second part of deployment:"
    echo "bash deploy_celo.sh"
else
    echo "❌ KYCChecker deployment failed!"
    exit 1
fi