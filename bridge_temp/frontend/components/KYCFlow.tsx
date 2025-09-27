import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle, QrCode } from 'lucide-react';

// Contract addresses and ABIs
const AADHAAR_KYC_ADDRESS = '0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159'; // Celo Alfajores
const KYC_CHECKER_ADDRESS = '0x9ED71781F2C175EDb569E9ecE1d739F716063c51'; // Polygon Amoy

const AADHAAR_KYC_ABI = [
  {
    name: 'checkKYC',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'isVerified', type: 'bool' },
      { name: 'kycUrl', type: 'string' },
      { name: 'qrCodeUrl', type: 'string' }
    ]
  },
  {
    name: 'requestKYC',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: []
  },
  {
    name: 'estimateKYCFees',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'fee', type: 'uint256' }]
  }
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
      { name: 'qrCodeUrl', type: 'string' }
    ]
  }
] as const;

interface KYCFlowProps {
  userAddress: string;
  chainId: number;
}

interface KYCStatus {
  isVerified: boolean;
  kycUrl: string;
  qrCodeUrl: string;
}

export function KYCFlow({ userAddress, chainId }: KYCFlowProps) {
  const [showQR, setShowQR] = useState(false);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Select contract based on chain
  const contractAddress = chainId === 44787 ? AADHAAR_KYC_ADDRESS : KYC_CHECKER_ADDRESS;
  const contractABI = chainId === 44787 ? AADHAAR_KYC_ABI : KYC_CHECKER_ABI;

  // Read KYC status
  const { data: kycData, refetch: refetchKYC } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'checkKYC',
    args: [userAddress as `0x${string}`],
  });

  // Estimate fees for KYC request (Celo only)
  const { data: estimatedFee } = useReadContract({
    address: AADHAAR_KYC_ADDRESS as `0x${string}`,
    abi: AADHAAR_KYC_ABI,
    functionName: 'estimateKYCFees',
    args: [userAddress as `0x${string}`],
    query: { enabled: chainId === 44787 }
  });

  // Write contract for KYC request (Celo only)
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Update KYC status when data changes
  useEffect(() => {
    if (kycData) {
      const [isVerified, kycUrl, qrCodeUrl] = kycData as [boolean, string, string];
      setKycStatus({ isVerified, kycUrl, qrCodeUrl });
    }
  }, [kycData]);

  // Start polling after KYC request
  useEffect(() => {
    if (isConfirmed && !kycStatus?.isVerified) {
      setIsPolling(true);
      const interval = setInterval(async () => {
        const result = await refetchKYC();
        if (result.data) {
          const [isVerified] = result.data as [boolean, string, string];
          if (isVerified) {
            setIsPolling(false);
            clearInterval(interval);
          }
        }
      }, 5000); // Poll every 5 seconds

      // Stop polling after 10 minutes
      const timeout = setTimeout(() => {
        setIsPolling(false);
        clearInterval(interval);
      }, 600000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isConfirmed, kycStatus?.isVerified, refetchKYC]);

  const handleRequestKYC = async () => {
    if (chainId !== 44787) {
      alert('KYC requests can only be made on Celo Alfajores');
      return;
    }

    try {
      writeContract({
        address: AADHAAR_KYC_ADDRESS as `0x${string}`,
        abi: AADHAAR_KYC_ABI,
        functionName: 'requestKYC',
        args: [userAddress as `0x${string}`],
        value: estimatedFee as bigint || parseEther('0.01')
      });
    } catch (err) {
      console.error('Failed to request KYC:', err);
    }
  };

  const handleShowQR = () => {
    setShowQR(!showQR);
  };

  if (!kycStatus) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading KYC Status...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {kycStatus.isVerified ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              KYC Verified
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              KYC Required
            </>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {kycStatus.isVerified ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your identity has been verified and synced across chains.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete KYC verification using Aadhaar through Self Protocol.
              </AlertDescription>
            </Alert>

            {chainId === 44787 && (
              <div className="space-y-3">
                <Button
                  onClick={handleRequestKYC}
                  disabled={isPending || isConfirming}
                  className="w-full"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request KYC Verification'
                  )}
                </Button>

                {estimatedFee && (
                  <p className="text-sm text-gray-600">
                    Estimated fee: {Number(estimatedFee) / 1e18} CELO
                  </p>
                )}
              </div>
            )}

            {kycStatus.qrCodeUrl && (
              <div className="space-y-3">
                <Button
                  onClick={handleShowQR}
                  variant="outline"
                  className="w-full"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {showQR ? 'Hide QR Code' : 'Show QR Code for Mobile'}
                </Button>

                {showQR && (
                  <div className="flex flex-col items-center space-y-3 p-4 bg-white rounded-lg border">
                    <QRCode
                      value={kycStatus.qrCodeUrl}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                    <p className="text-sm text-center text-gray-600">
                      Scan with your mobile device to complete KYC
                    </p>
                    <a
                      href={kycStatus.kycUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Or click here to open verification page
                    </a>
                  </div>
                )}
              </div>
            )}

            {isPolling && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Waiting for verification completion...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error: {error.message}
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default KYCFlow;