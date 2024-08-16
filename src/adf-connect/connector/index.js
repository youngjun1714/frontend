import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { polygon, polygonAmoy } from 'viem/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ConnectModal from '@/adf-connect/components/connect-modal';
import { ConnectModalContextProvider } from '@/adf-connect/contexts/ConnectModalContext';

// Setup queryClient
const queryClient = new QueryClient();

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  throw new Error(
    'You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable'
  );
}
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Configure wagmiConfig
const chains = [
  process.env.NEXT_PUBLIC_IS_MAINNET === 'true' ? polygon : polygonAmoy,
];

const metadata = {
  name: 'Artiside',
  description: 'Artiside',
  url: process.env.NEXT_PUBLIC_ARTISIDE_URL,
  icons: [`${process.env.NEXT_PUBLIC_ARTISIDE_URL}/favicon-32x32.png`],
};

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
});

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeVariables: {
    '--w3m-z-index': 1600,
  },
});

const Connector = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <ConnectModalContextProvider>
        {children}
        <ConnectModal />
      </ConnectModalContextProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default Connector;
