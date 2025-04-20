// wallet.ts
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { Web3Modal } from '@web3modal/ethereum';

export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // Get one at https://cloud.walletconnect.com

const chains = [mainnet, goerli];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
