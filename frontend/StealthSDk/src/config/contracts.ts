// Contract configuration for StealthSDK
export const CONTRACTS = {
  POLYGON_AMOY: {
    chainId: 80002,
    chainName: 'Polygon Amoy Testnet',
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    blockExplorer: 'https://amoy.polygonscan.com/',
    contracts: {
      PYUSD: '0x21d4e74BC1869c7c53ECf477747EC1c2BE9336e1',
      POOL_A: '0x821E700b376F12c14b6878Db70Df6e07B01E5792',
      POOL_B: '0x0fd4286E85fe448c12B79815E0B4123Cd086F63E',
      POOL_C: '0x8E3168aFECe8912b5ddA4A52dc2fF6E03B1E4d4F',
      POOL_D: '0xcbEd44AB6621A77d9f0927925BD7D9B74EF2Fe20',
      FRAGMENT_MANAGER: '0x87D7170db294F33233518aE50c84d50A83c2EfbD',
      // KYC contract - using fragment manager temporarily
      KYC: '0x87D7170db294F33233518aE50c84d50A83c2EfbD'
    }
  }
} as const;

export const DEFAULT_NETWORK = CONTRACTS.POLYGON_AMOY;

// Environment variable getters with fallbacks
export const getContractAddress = (contractName: keyof typeof DEFAULT_NETWORK.contracts): string => {
  const envVarMap = {
    PYUSD: import.meta.env.VITE_PYUSD_CONTRACT_ADDRESS,
    POOL_A: import.meta.env.VITE_POOL_A_ADDRESS,
    POOL_B: import.meta.env.VITE_POOL_B_ADDRESS,
    POOL_C: import.meta.env.VITE_POOL_C_ADDRESS,
    POOL_D: import.meta.env.VITE_POOL_D_ADDRESS,
    FRAGMENT_MANAGER: import.meta.env.VITE_FRAGMENT_MANAGER_ADDRESS,
    KYC: import.meta.env.VITE_KYC_CONTRACT_ADDRESS
  };
  
  return envVarMap[contractName] || DEFAULT_NETWORK.contracts[contractName];
};

export const getNetworkConfig = () => ({
  chainId: parseInt(import.meta.env.VITE_CHAIN_ID) || DEFAULT_NETWORK.chainId,
  chainName: import.meta.env.VITE_NETWORK_NAME || DEFAULT_NETWORK.chainName,
  rpcUrl: import.meta.env.VITE_RPC_URL || DEFAULT_NETWORK.rpcUrl,
});