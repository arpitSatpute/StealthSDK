/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_PYUSD_TOKEN_ADDRESS: string
  readonly VITE_POOL_A_ADDRESS: string
  readonly VITE_POOL_B_ADDRESS: string
  readonly VITE_POOL_C_ADDRESS: string
  readonly VITE_POOL_D_ADDRESS: string
  readonly VITE_FRAGMENT_MANAGER_ADDRESS: string
  readonly VITE_CHAIN_ID: string
  readonly VITE_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Extend Window interface for Web3/MetaMask
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}
