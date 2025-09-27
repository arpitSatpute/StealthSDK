import { http, createConfig } from 'wagmi';
import { celoAlfajores, polygonAmoy } from 'wagmi/chains';
import { connectkit } from 'connectkit';

export const config = createConfig(
  connectkit({
    chains: [celoAlfajores, polygonAmoy],
    transports: {
      [celoAlfajores.id]: http('https://alfajores-forno.celo-testnet.org'),
      [polygonAmoy.id]: http('https://rpc-amoy.polygon.technology/'),
    },
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  })
);