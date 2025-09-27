import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from './config/wagmi';
import KYCTester from './components/KYCTester';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  StealthSDK KYC Bridge
                </h1>
                <p className="text-xl text-gray-600">
                  Cross-chain Aadhaar KYC verification powered by Self Protocol & LayerZero
                </p>
              </div>
              
              <div className="flex justify-center">
                <KYCTester />
              </div>
            </div>
          </div>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;