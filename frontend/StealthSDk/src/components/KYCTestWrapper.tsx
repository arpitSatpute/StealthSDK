import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  WalletIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LinkIcon,
  QrCodeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { 
  useAccount, 
  useConnect, 
  useDisconnect, 
  useSwitchChain, 
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId
} from 'wagmi';
import { parseEther, formatEther, isAddress } from 'viem';
import { ConnectKitButton } from 'connectkit';
import { toast } from 'react-hot-toast';

// Contract addresses from deployment
const CONTRACTS = {
  CELO_SEPOLIA: {
    AADHAAR_KYC: '0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159' as `0x${string}`,
    CHAIN_ID: 11142220,
    LAYER_ZERO_CHAIN_ID: 10132
  },
  POLYGON_AMOY: {
    KYC_CHECKER: '0x9ED71781F2C175EDb569E9ecE1d739F716063c51' as `0x${string}`,
    CHAIN_ID: 80002,
    LAYER_ZERO_CHAIN_ID: 10160
  }
};

// ABIs
const AADHAAR_KYC_ABI = [
  {
    name: 'mockSelfProtocolCallback',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [],
  },
  {
    name: 'isKYCVerified',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

const KYC_CHECKER_ABI = [
  {
    name: 'checkKYC',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'isVerified', type: 'bool' },
      { name: 'kycUrl', type: 'string' },
      { name: 'qrCodeUrl', type: 'string' },
    ],
  },
] as const;

const KYCTester: React.FC = () => {
  const [testAddress, setTestAddress] = useState<string>('');

  const { address, isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending } = useWriteContract();

  useEffect(() => {
    if (address && !testAddress) {
      setTestAddress(address);
    }
  }, [address, testAddress]);

  const { data: celoKYCStatus } = useReadContract({
    address: CONTRACTS.CELO_SEPOLIA.AADHAAR_KYC,
    abi: AADHAAR_KYC_ABI,
    functionName: 'isKYCVerified',
    args: testAddress && isAddress(testAddress) ? [testAddress as `0x${string}`] : undefined,
    chainId: CONTRACTS.CELO_SEPOLIA.CHAIN_ID,
  });

  const { data: polygonKYCData } = useReadContract({
    address: CONTRACTS.POLYGON_AMOY.KYC_CHECKER,
    abi: KYC_CHECKER_ABI,
    functionName: 'checkKYC',
    args: testAddress && isAddress(testAddress) ? [testAddress as `0x${string}`] : undefined,
    chainId: CONTRACTS.POLYGON_AMOY.CHAIN_ID,
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('KYC verification completed successfully!');
    }
  }, [isConfirmed]);

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case CONTRACTS.CELO_SEPOLIA.CHAIN_ID:
        return 'Celo Sepolia';
      case CONTRACTS.POLYGON_AMOY.CHAIN_ID:
        return 'Polygon Amoy';
      default:
        return `Chain ${chainId}`;
    }
  };

  const handleSwitchNetwork = (networkType: 'celo' | 'polygon') => {
    const targetChainId = networkType === 'celo' 
      ? CONTRACTS.CELO_SEPOLIA.CHAIN_ID 
      : CONTRACTS.POLYGON_AMOY.CHAIN_ID;

    switchChain({ chainId: targetChainId }, {
      onSuccess: () => {
        toast.success(`Switched to ${networkType === 'celo' ? 'Celo Sepolia' : 'Polygon Amoy'}`);
      },
      onError: () => {
        toast.error('Failed to switch network');
      }
    });
  };

  const simulateKYCVerification = () => {
    if (!isConnected || !testAddress || !isAddress(testAddress)) {
      toast.error('Please connect wallet and enter a valid address');
      return;
    }

    if (chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID) {
      toast.error('Please switch to Celo Sepolia network first');
      return;
    }
    
    writeContract({
      address: CONTRACTS.CELO_SEPOLIA.AADHAAR_KYC,
      abi: AADHAAR_KYC_ABI,
      functionName: 'mockSelfProtocolCallback',
      args: [testAddress as `0x${string}`],
    }, {
      onError: () => {
        toast.error('Failed to simulate KYC verification');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Cross-Chain KYC Bridge
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test KYC verification across Celo and Polygon networks using LayerZero protocol
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Wallet Connection Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <WalletIcon className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-900">Wallet Connection</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ConnectKitButton />
              {isConnected && (
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <span>{getNetworkName(chainId)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test Address Input */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Address</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                placeholder="Enter wallet address (0x...)"
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => toast.success('KYC status refreshed!')}
                disabled={!testAddress || !isAddress(testAddress)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Refresh
              </button>
            </div>
          </div>

          {/* KYC Status Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Celo Status */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Celo Sepolia</h3>
                  <p className="text-sm text-gray-600">Source Chain</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                  <span className="text-gray-700">KYC Status</span>
                  <div className="flex items-center gap-2">
                    {celoKYCStatus ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-700">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSwitchNetwork('celo')}
                  disabled={!isConnected}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-colors"
                >
                  Switch to Celo
                </button>
              </div>
            </div>

            {/* Polygon Status */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Polygon Amoy</h3>
                  <p className="text-sm text-gray-600">Destination Chain</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl">
                  <span className="text-gray-700">KYC Status</span>
                  <div className="flex items-center gap-2">
                    {polygonKYCData?.[0] ? (
                      <>
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-green-700">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-700">Not Verified</span>
                      </>
                    )}
                  </div>
                </div>

                {!polygonKYCData?.[0] && polygonKYCData?.[1] && (
                  <div className="space-y-2">
                    <a 
                      href={polygonKYCData[1]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <LinkIcon className="w-4 h-4" />
                      KYC Portal
                    </a>
                    {polygonKYCData[2] && (
                      <a 
                        href={polygonKYCData[2]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <QrCodeIcon className="w-4 h-4" />
                        QR Code
                      </a>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleSwitchNetwork('polygon')}
                  disabled={!isConnected}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-2xl font-medium transition-colors"
                >
                  Switch to Polygon
                </button>
              </div>
            </div>
          </div>

          {/* Simulate KYC */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-6">
                <ArrowRightIcon className="w-8 h-8 text-amber-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Simulate KYC Verification
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Simulate KYC verification on Celo Sepolia and automatically sync status to Polygon Amoy via LayerZero cross-chain messaging
              </p>

              {chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID && isConnected && (
                <div className="flex items-center gap-3 justify-center p-4 bg-amber-50 rounded-2xl mb-6">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                  <span className="text-amber-700 font-medium">
                    Switch to Celo Sepolia network to continue
                  </span>
                </div>
              )}

              <button
                onClick={simulateKYCVerification}
                disabled={isPending || isConfirming || !isConnected || chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID || !testAddress || !isAddress(testAddress)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl font-semibold transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isPending ? 'Confirming Transaction...' : 
                 isConfirming ? 'Processing Cross-Chain...' : 
                 'Start KYC Verification'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with providers
import { http, createConfig } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { Toaster } from 'react-hot-toast';

const celoSepolia = {
  id: 11142220,
  name: 'Celo Sepolia',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://celo-sepolia.g.alchemy.com/v2/Tz5b8XWL2oTDtmfPsdXPx'] },
  },
  blockExplorers: {
    default: { name: 'Celoscan', url: 'https://explorer.celo.org/alfajores' },
  },
  testnet: true,
} as const;

const polygonAmoyCustom = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://polygon-amoy.g.alchemy.com/v2/7NX8baKoW_-wNuAxpgZnk'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
} as const;

const config = createConfig(
  getDefaultConfig({
    chains: [celoSepolia, polygonAmoyCustom],
    transports: {
      [celoSepolia.id]: http('https://celo-sepolia.g.alchemy.com/v2/Tz5b8XWL2oTDtmfPsdXPx'),
      [polygonAmoyCustom.id]: http('https://polygon-amoy.g.alchemy.com/v2/7NX8baKoW_-wNuAxpgZnk'),
    },
    walletConnectProjectId: 'your-walletconnect-project-id',
    appName: 'StealthSDK KYC Tester',
    appDescription: 'Cross-chain KYC verification testing interface',
  })
);

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
              }
            }}
          />
          <KYCTester />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;