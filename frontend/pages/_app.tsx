import Layout from '@/components/layout';
import ClientOnly from '@/components/layout/clientOnly';
import '@/internationalization/i18n';
import MedusaProvider from '@/providers/MedusaProvider';
import SpinnerProvider from '@/providers/SpinnerProvider';
import TokenAddressProvider from '@/providers/TokenAddressProvider';
import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans/700.css';
import { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { polygonMumbai } from "wagmi/chains"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// const hyperspaceChain = {
//   id: 3141,
//   name: 'Filecoin - Hyperspace testnet',
//   network: 'Filecoin Hyperspace testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Testnet Filecoin',
//     symbol: 'tFil',
//   },
//   rpcUrls: {
//     public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
//     default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
//   },
//   blockExplorers: {
//     public: { name: 'Glif', url: 'https://explorer.glif.io/' },
//     default: { name: 'Glif', url: 'https://explorer.glif.io/' },
//   },
// };
const { chains, provider, webSocketProvider } = configureChains(
  [polygonMumbai],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        console.log({ chain });
        return { http: "https://polygon-mumbai.g.alchemy.com/v2/XcG0U49rmR40kygsOE2Z2MrqtZxXYjGS" };
      },
    }),
  ]
);
let client;
if (typeof window !== 'undefined') {
  client = createClient({
    autoConnect: true,
    provider,
    connectors: [new InjectedConnector({ chains })],
    webSocketProvider,
  });
}
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <ClientOnly>
        <WagmiConfig client={client}>
          <TokenAddressProvider>
            <MedusaProvider>
              <SpinnerProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SpinnerProvider>
            </MedusaProvider>
          </TokenAddressProvider>
        </WagmiConfig>
      </ClientOnly>
    </ChakraProvider>
  );
};

export default App;
