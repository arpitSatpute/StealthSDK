# StealthSDK Deployment Summary

## Network: Polygon Amoy Testnet (Chain ID: 80002)

## Deployed Contracts

### PyUSD Token Contract
- **Address:** `0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1`
- **Name:** PayPal USD
- **Symbol:** PYUSD
- **Features:** 
  - ERC20 token with airdrop functionality
  - 10,000 PYUSD per address via `airDrop()` function
  - Owner can mint/burn tokens

### Pool Contracts (4 Independent Privacy Pools)
- **Pool A:** `0x821E700b376F12c14b6878Db70Df6e07B01E5792`
- **Pool B:** `0x0fd4286E85fe448c12B79815E0B4123Cd086F63E`
- **Pool C:** `0x8E3168aFECe8912b5ddA4A52dc2fF6E03B1E4d4F`
- **Pool D:** `0xcbEd44AB6621A77d9f0927925BD7D9B74EF2Fe20`

**Features:**
- Each pool accepts PyUSD deposits
- 5 block withdrawal delay for security
- Independent deposit tracking per pool
- Used for fragmenting transactions across multiple pools

### FragmentManager Contract
- **Address:** `0x87D7170db294F33233518aE50c84d50A83c2EfbD`
- **Purpose:** Core logic for multi-level stealth transactions
- **Connected to:** PyUSD token + all 4 pool contracts
- **Features:**
  - Level 1-4 fragmentation support
  - Distributes deposits across multiple pools
  - Tracks deposits by stealth address and transaction ID
  - Enables complex privacy-preserving transactions

## Contract Owner
- **Owner Address:** `0xAFc7da0540Ce66a7Cbb26b4D0f538fad6a8d6b8a`
- **Controls:** All deployed contracts

## Next Steps for Testing

1. **Get PyUSD Tokens:**
   ```bash
   cast send 0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1 "airDrop(address)" YOUR_ADDRESS --private-key YOUR_KEY --rpc-url amoy
   ```

2. **Approve FragmentManager:**
   ```bash
   cast send 0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1 "approve(address,uint256)" 0x87D7170db294F33233518aE50c84d50A83c2EfbD MAX_UINT256 --private-key YOUR_KEY --rpc-url amoy
   ```

3. **Test Fragment Deposits:**
   - Use FragmentManager to deposit fragments across multiple pools
   - Test different fragmentation levels (1-4)
   - Verify stealth address associations

## Architecture Benefits

- **Privacy:** Transactions fragmented across multiple pools
- **Flexibility:** Support for 1-4 level complexity
- **Security:** Time delays and proper access controls
- **Modularity:** Each component serves specific purpose
- **Testability:** Complete infrastructure for testing stealth transactions

## Block Explorer Links
- **Polygon Amoy Explorer:** https://amoy.polygonscan.com/
- View any contract by appending the address to: `https://amoy.polygonscan.com/address/`

Deployment completed successfully! 🎉