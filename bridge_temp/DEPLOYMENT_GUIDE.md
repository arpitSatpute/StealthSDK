# LayerZero Cross-Chain KYC Bridge Deployment Guide

## Prerequisites

1. **Install Foundry** (if not already installed):
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Get Testnet Tokens**:
   - **Celo Alfajores**: Get CELO from [Celo Faucet](https://faucet.celo.org/alfajores)
   - **Polygon Amoy**: Get MATIC from [Polygon Faucet](https://faucet.polygon.technology/)

3. **Get Private Keys**:
   - Create test wallets for deployment
   - Export private keys (never use mainnet keys!)

## Step 1: Configuration

1. **Update .env file** with your credentials:
```bash
cd /Users/arpitrameshsatpute/Desktop/ETHGlobalGithub/StealthSDK/contracts
cp .env .env.example  # Keep a template
# Edit .env with your actual values
```

Required variables:
```env
# Private Keys (GET FROM YOUR TEST WALLETS)
CELO_PRIVATE_KEY=0x1234567890abcdef...
POLYGON_PRIVATE_KEY=0x1234567890abcdef...

# RPC URLs (Already configured)
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# LayerZero Endpoints (Already configured)
CELO_LZ_ENDPOINT=0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0
POLYGON_LZ_ENDPOINT=0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0

# Chain IDs (Already configured)
CELO_CHAIN_ID=10132
POLYGON_CHAIN_ID=10160
```

## Step 2: Deploy KYCChecker on Polygon Amoy

```bash
forge script src/bridge/script/DeploySimpleKYCChecker.s.sol:DeploySimpleKYCChecker \
  --rpc-url $POLYGON_RPC_URL \
  --broadcast \
  --verify
```

**Save the deployed KYCChecker address!**

## Step 3: Deploy AadhaarKYC on Celo Alfajores

First, add the KYCChecker address to your .env:
```env
KYC_CHECKER_ADDRESS=0x... # Address from Step 2
```

Then deploy:
```bash
forge script src/bridge/script/DeploySimpleAadhaarKYC.s.sol:DeploySimpleAadhaarKYC \
  --rpc-url $CELO_RPC_URL \
  --broadcast
```

## Step 4: Configure Trusted Remotes

```bash
forge script src/bridge/script/ConfigureTrustedRemotes.s.sol:ConfigureTrustedRemotes \
  --sig 'setTrustedRemoteOnKYCChecker(address,address)' \
  <KYC_CHECKER_ADDRESS> <AADHAAR_KYC_ADDRESS> \
  --rpc-url $POLYGON_RPC_URL \
  --broadcast
```

## Step 5: Test the Bridge

### Test KYC Verification on Celo:
```bash
# Using cast to call the mock KYC function
cast send <AADHAAR_KYC_ADDRESS> \
  "mockSelfProtocolCallback(address)" <USER_ADDRESS> \
  --rpc-url $CELO_RPC_URL \
  --private-key $CELO_PRIVATE_KEY
```

### Check KYC Status on Polygon:
```bash
cast call <KYC_CHECKER_ADDRESS> \
  "checkKYC(address)(bool,string,string)" <USER_ADDRESS> \
  --rpc-url $POLYGON_RPC_URL
```

## Example Complete Deployment

```bash
# 1. Deploy on Polygon
forge script src/bridge/script/DeploySimpleKYCChecker.s.sol:DeploySimpleKYCChecker \
  --rpc-url https://rpc-amoy.polygon.technology \
  --broadcast

# Output: SimpleKYCChecker deployed to: 0xABC123...

# 2. Update .env with the address
echo "KYC_CHECKER_ADDRESS=0xABC123..." >> .env

# 3. Deploy on Celo
forge script src/bridge/script/DeploySimpleAadhaarKYC.s.sol:DeploySimpleAadhaarKYC \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast

# Output: SimpleAadhaarKYC deployed to: 0xDEF456...

# 4. Configure trusted remotes
forge script src/bridge/script/ConfigureTrustedRemotes.s.sol:ConfigureTrustedRemotes \
  --sig 'setTrustedRemoteOnKYCChecker(address,address)' \
  0xABC123... 0xDEF456... \
  --rpc-url https://rpc-amoy.polygon.technology \
  --broadcast

# 5. Test KYC verification
cast send 0xDEF456... \
  "mockSelfProtocolCallback(address)" 0xYourTestAddress... \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --private-key $CELO_PRIVATE_KEY

# 6. Check status on Polygon
cast call 0xABC123... \
  "checkKYC(address)(bool,string,string)" 0xYourTestAddress... \
  --rpc-url https://rpc-amoy.polygon.technology
```

## Troubleshooting

### Common Issues:

1. **Insufficient funds**: Make sure both wallets have testnet tokens
2. **LayerZero fees**: The Celo contract needs CELO for cross-chain messages
3. **Private key format**: Should start with `0x`
4. **RPC issues**: Try different RPC endpoints if one fails

### Check Deployment Status:
```bash
# Check if contract is deployed
cast code <CONTRACT_ADDRESS> --rpc-url <RPC_URL>

# Check contract owner
cast call <CONTRACT_ADDRESS> "owner()(address)" --rpc-url <RPC_URL>

# Check LayerZero endpoint
cast call <CONTRACT_ADDRESS> "lzEndpoint()(address)" --rpc-url <RPC_URL>
```

## Next Steps

After successful deployment:

1. **Integrate with Self Protocol**: Replace mock functions with actual Self Protocol integration
2. **Frontend Integration**: Use the contracts in your dApp
3. **Monitor Events**: Set up event monitoring for KYC updates
4. **Fee Management**: Monitor and top up LayerZero fees as needed

## Contract Addresses (Save These!)

After deployment, save your contract addresses:

```
Polygon Amoy KYCChecker: 0x...
Celo Alfajores AadhaarKYC: 0x...
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure sufficient testnet tokens in both wallets
4. Check LayerZero documentation for any endpoint updates