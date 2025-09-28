/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_PYUSD_CONTRACT_ADDRESS: string;
  readonly VITE_POOL_A_ADDRESS: string;
  readonly VITE_POOL_B_ADDRESS: string;
  readonly VITE_POOL_C_ADDRESS: string;
  readonly VITE_POOL_D_ADDRESS: string;
  readonly VITE_FRAGMENT_MANAGER_ADDRESS: string;
  readonly VITE_KYC_CONTRACT_ADDRESS: string;
  readonly VITE_CHAIN_ID: string;
  readonly VITE_NETWORK_NAME: string;
  readonly VITE_RPC_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global Window extension for Web3
declare global {
  interface Window {
    ethereum?: any;
  }
}

export {};