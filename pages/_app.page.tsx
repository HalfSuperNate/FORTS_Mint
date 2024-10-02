import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import {
  // arbitrum,
  // goerli,
  // mainnet,
  // optimism,
  // polygon,
  // zora,
  //polygonMumbai,
  polygonAmoy
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient, } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'FORTS',
  projectId: '43e1f16f66aacf153df114054a18202b',
  chains: [
    //mainnet, 
    //polygon, 
    //optimism, 
    //arbitrum, 
    //base, 
    //zora,
    //polygonMumbai,
    polygonAmoy
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
