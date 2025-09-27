import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
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

// ABI for SimpleAadhaarKYC contract
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
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

// ABI for SimpleKYCChecker contract
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
  {
    name: 'isKYCVerified',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

interface KYCStatus {
  isVerified: boolean;
  kycUrl?: string;
  qrCodeUrl?: string;
}

const KYCTester: React.FC = () => {
  const [testAddress, setTestAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  // Set test address to connected wallet address when connected
  useEffect(() => {
    if (address && !testAddress) {
      setTestAddress(address);
    }
  }, [address, testAddress]);

  // Read contracts for KYC status
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

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isConfirmed) {
      toast.success('KYC verification simulated! Cross-chain message sent to Polygon.');
    }
  }, [isConfirmed]);

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case CONTRACTS.CELO_SEPOLIA.CHAIN_ID:
        return 'Celo Sepolia';
      case CONTRACTS.POLYGON_AMOY.CHAIN_ID:
        return 'Polygon Amoy';
      default:
        return `Unknown (${chainId})`;
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
      onError: (error) => {
        toast.error('Failed to switch network');
        console.error('Error switching network:', error);
      }
    });
  };

  const refreshKYCStatus = () => {
    if (!testAddress || !isAddress(testAddress)) {
      toast.error('Please enter a valid address');
      return;
    }
    toast.success('KYC status refreshed!');
    // The useReadContract hooks will automatically refetch
  };

  const simulateKYCVerification = () => {
    if (!isConnected || !testAddress || !isAddress(testAddress)) {
      toast.error('Please connect wallet and enter a valid address');
      return;
    }

    // Check if we're on Celo network
    if (chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID) {
      toast.error('Please switch to Celo Sepolia network first');
      return;
    }

    toast.loading('Simulating KYC verification...', { duration: 2000 });
    
    writeContract({
      address: CONTRACTS.CELO_SEPOLIA.AADHAAR_KYC,
      abi: AADHAAR_KYC_ABI,
      functionName: 'mockSelfProtocolCallback',
      args: [testAddress as `0x${string}`],
    }, {
      onError: (error) => {
        toast.error('Failed to simulate KYC verification');
        console.error('Error simulating KYC:', error);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Cross-Chain KYC Bridge Tester
      </h1>

      {/* Wallet Connection */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Wallet Connection</h2>
        <div className="flex items-center gap-4">
          <ConnectKitButton />
          {isConnected && (
            <div>
              <p className="text-sm text-gray-600">Connected: {address}</p>
              <p className="text-sm text-gray-600">Network: {getNetworkName(chainId)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Network Switching */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Network Controls</h2>
        <div className="flex gap-3">
          <button
            onClick={() => handleSwitchNetwork('celo')}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={!isConnected}
          >
            Switch to Celo Sepolia
          </button>
          <button
            onClick={() => handleSwitchNetwork('polygon')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={!isConnected}
          >
            Switch to Polygon Amoy
          </button>
        </div>
      </div>

      {/* Test Address Input */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Test Address</h2>
        <input
          type="text"
          value={testAddress}
          onChange={(e) => setTestAddress(e.target.value)}
          placeholder="Enter address to test (0x...)"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={refreshKYCStatus}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={!testAddress || !isAddress(testAddress)}
        >
          Refresh KYC Status
        </button>
      </div>

      {/* KYC Status Display */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Celo Status */}
        <div className="p-4 bg-green-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 text-green-800">
            Celo Sepolia - AadhaarKYC
          </h3>
          <p className="text-sm text-gray-600 mb-2">Contract: {CONTRACTS.CELO_SEPOLIA.AADHAAR_KYC}</p>
          <p className="text-lg">
            Status: <span className={`font-bold ${celoKYCStatus ? 'text-green-600' : 'text-red-600'}`}>
              {celoKYCStatus ? '✅ Verified' : '❌ Not Verified'}
            </span>
          </p>
        </div>

        {/* Polygon Status */}
        <div className="p-4 bg-purple-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">
            Polygon Amoy - KYCChecker
          </h3>
          <p className="text-sm text-gray-600 mb-2">Contract: {CONTRACTS.POLYGON_AMOY.KYC_CHECKER}</p>
          <p className="text-lg">
            Status: <span className={`font-bold ${polygonKYCData?.[0] ? 'text-green-600' : 'text-red-600'}`}>
              {polygonKYCData?.[0] ? '✅ Verified' : '❌ Not Verified'}
            </span>
          </p>
          {!polygonKYCData?.[0] && polygonKYCData?.[1] && (
            <div className="mt-2 text-sm">
              <p className="text-gray-600">KYC URL: 
                <a href={polygonKYCData[1]} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-500 hover:underline ml-1">
                  {polygonKYCData[1]}
                </a>
              </p>
              {polygonKYCData[2] && (
                <p className="text-gray-600">QR Code: 
                  <a href={polygonKYCData[2]} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-500 hover:underline ml-1">
                    View QR Code
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Simulate KYC */}
      <div className="p-4 bg-yellow-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-3 text-yellow-800">Simulate KYC Verification</h2>
        <p className="text-sm text-gray-600 mb-3">
          This will simulate a KYC verification on Celo and send a cross-chain message to Polygon via LayerZero.
          Make sure you're connected to Celo Sepolia network.
        </p>
        <button
          onClick={simulateKYCVerification}
          disabled={isPending || isConfirming || !isConnected || chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Simulate KYC Verification'}
        </button>
        {chainId !== CONTRACTS.CELO_SEPOLIA.CHAIN_ID && isConnected && (
          <p className="text-sm text-red-600 mt-2">
            Please switch to Celo Sepolia network to simulate KYC verification
          </p>
        )}
      </div>

      {/* Contract Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Contract Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-green-700">Celo Sepolia</h3>
            <p>Chain ID: {CONTRACTS.CELO_SEPOLIA.CHAIN_ID}</p>
            <p>LayerZero Chain ID: {CONTRACTS.CELO_SEPOLIA.LAYER_ZERO_CHAIN_ID}</p>
            <p className="break-all">AadhaarKYC: {CONTRACTS.CELO_SEPOLIA.AADHAAR_KYC}</p>
          </div>
          <div>
            <h3 className="font-semibold text-purple-700">Polygon Amoy</h3>
            <p>Chain ID: {CONTRACTS.POLYGON_AMOY.CHAIN_ID}</p>
            <p>LayerZero Chain ID: {CONTRACTS.POLYGON_AMOY.LAYER_ZERO_CHAIN_ID}</p>
            <p className="break-all">KYCChecker: {CONTRACTS.POLYGON_AMOY.KYC_CHECKER}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCTester;