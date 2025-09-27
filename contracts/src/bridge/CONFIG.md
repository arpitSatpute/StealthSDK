# LayerZero Cross-Chain KYC Bridge Configuration

## LayerZero Endpoints (Testnet)
- **Celo Alfajores**: `0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0`
- **Polygon Amoy**: `0x6aB5Ae682764dB4A8cC7E6C54fA00a93Bc1E8ae0`

## LayerZero Chain IDs
- **Celo Alfajores**: `10132`
- **Polygon Amoy**: `10160`

## RPC Endpoints
- **Celo Alfajores**: `https://alfajores-forno.celo-testnet.org`
- **Polygon Amoy**: `https://rpc-amoy.polygon.technology`

## Self Protocol Configuration
- **Hub Address**: `TBD` (Replace with actual Self Protocol hub address)
- **Scope Seed**: `TBD` (Replace with your application's scope seed)
- **KYC URLs**: 
  - KYC Page: `https://kyc.self.xyz/aadhaar`
  - QR Code: `https://kyc.self.xyz/aadhaar/qr`

## Gas Configuration
- **LayerZero Gas Limit**: `200,000`
- **Adapter Params Version**: `1`

## Security Notes
- Always verify LayerZero endpoint addresses from official documentation
- Update Self Protocol URLs to production endpoints before mainnet
- Fund AadhaarKYC contract with sufficient CELO for LayerZero fees
- Configure trusted remotes on both chains after deployment

## Deployment Checklist
- [ ] Update Self Protocol hub address
- [ ] Set correct scope seed
- [ ] Verify LayerZero endpoints are current
- [ ] Deploy AadhaarKYC on Celo Alfajores
- [ ] Deploy KYCChecker on Polygon Amoy  
- [ ] Configure trusted remotes on both contracts
- [ ] Fund AadhaarKYC with CELO for fees
- [ ] Test KYC verification flow
- [ ] Update frontend integration
- [ ] Monitor events and fees