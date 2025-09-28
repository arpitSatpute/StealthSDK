import { createConfig, http } from 'wagmi';
import { injected, metaMask } from 'wagmi/connectors';
import { Chain } from 'viem';

const polygonAmoy: Chain = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
    public: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PolygonScan',
      url: 'https://amoy.polygonscan.com',
    },
  },
  testnet: true,
};

export const config = createConfig({
  chains: [polygonAmoy],
  connectors: [metaMask,
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [polygonAmoy.id]: http(),
  },
  ssr: true,
});
