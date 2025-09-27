import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle, AlertCircle, Network } from 'lucide-react';
import KYCFlow from './KYCFlow';

// Chain configurations
const CELO_ALFAJORES = {
  id: 44787,
  name: 'Celo Alfajores',
  kycContract: '0x7c5b31E895a74F9622Aff1320a0b4E4A7002d159'
};

const POLYGON_AMOY = {
  id: 80002,
  name: 'Polygon Amoy',
  kycContract: '0x9ED71781F2C175EDb569E9ecE1d739F716063c51'
};

export function KYCTester() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const [selectedChain, setSelectedChain] = useState(CELO_ALFAJORES);

  const handleSwitchChain = async (targetChain: typeof CELO_ALFAJORES) => {
    try {
      await switchChain({ chainId: targetChain.id });
      setSelectedChain(targetChain);
    } catch (error) {
      console.error('Failed to switch chain:', error);
    }
  };

  if (!isConnected || !address) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cross-Chain KYC Tester</CardTitle>
          <CardDescription>
            Please connect your wallet to test the LayerZero KYC bridge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your wallet to continue
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Cross-Chain KYC Tester
          </CardTitle>
          <CardDescription>
            Test Aadhaar KYC verification across Celo Alfajores and Polygon Amoy using LayerZero
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={chain?.id === CELO_ALFAJORES.id ? "default" : "secondary"}>
                Current: {chain?.name || 'Unknown'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedChain.id === CELO_ALFAJORES.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSwitchChain(CELO_ALFAJORES)}
                disabled={chain?.id === CELO_ALFAJORES.id}
              >
                Switch to Celo
              </Button>
              <Button
                variant={selectedChain.id === POLYGON_AMOY.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSwitchChain(POLYGON_AMOY)}
                disabled={chain?.id === POLYGON_AMOY.id}
              >
                Switch to Polygon
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Celo Alfajores KYC */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Badge variant="outline">Celo Alfajores</Badge>
            KYC Source
          </h3>
          <KYCFlow 
            userAddress={address}
            chainId={CELO_ALFAJORES.id}
          />
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Complete your Aadhaar KYC on Celo to enable cross-chain verification
            </AlertDescription>
          </Alert>
        </div>

        {/* Polygon Amoy KYC Checker */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Badge variant="outline">Polygon Amoy</Badge>
            KYC Checker
          </h3>
          <KYCFlow 
            userAddress={address}
            chainId={POLYGON_AMOY.id}
          />
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              KYC status is automatically synced from Celo via LayerZero
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">1</Badge>
            <p>Connect wallet and complete Aadhaar KYC verification on Celo Alfajores using Self Protocol</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">2</Badge>
            <p>KYC status is automatically sent to Polygon Amoy via LayerZero cross-chain messaging</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">3</Badge>
            <p>Check your verified status on Polygon Amoy without re-doing KYC</p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="mt-0.5">4</Badge>
            <p>QR codes are provided for mobile verification when needed</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default KYCTester;