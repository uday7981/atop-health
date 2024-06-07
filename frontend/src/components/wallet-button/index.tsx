import { Button, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SlWallet } from 'react-icons/sl';
import { EMPTY_BYTES } from 'src/data';
import useGetTokenAddress from 'src/hooks/useGetTokenAddress';

import useToastCustom from 'src/hooks/useToastCustom';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

function WalletConnectMinimum() {
  const router = useRouter();
  const { successToast, errorToast } = useToastCustom();
  const { address, isConnected } = useAccount();
  // const { data: tokenAddress, refetch } = useContractRead({
  //   address: PARENTCONTRACT,
  //   abi: ParentStorageAbi,
  //   functionName: 'accessMapping2',
  //   args: [address],
  // });
  const { tokenAddress, refetch: reFetechTokenAddress } = useGetTokenAddress();

  const { disconnect } = useDisconnect({
    async onSuccess(context) {
      console.log({ context });

      successToast('Account Disconnected');
      if (router.pathname == '/profile') {
        router.push('/');
      }
    },
  });
  const { connect, isSuccess, connectAsync } = useConnect({
    // chainId: 3141,
    connector: new InjectedConnector(),

    async onSuccess() {
      console.log({ tokenAddress });
    },
    onError() {
      errorToast('Error Connecting Account');
    },
  });
  const getWalletAction = () => {
    if (router.pathname == '/profile') {
      return isConnected && tokenAddress !== EMPTY_BYTES
        ? 'Disconnect '
        : isConnected
          ? 'Go to Sign Up'
          : 'Connect';
    } else {
      return isConnected && tokenAddress !== EMPTY_BYTES
        ? 'Open Profile '
        : isConnected
          ? 'Go to Sign Up'
          : 'Connect';
    }
  };
  return (
    <Button
      leftIcon={<SlWallet />}
      backgroundColor={'brand.500'}
      paddingInline={'2.4rem'}
      onClick={async () => {
        if (
          isConnected &&
          tokenAddress !== EMPTY_BYTES &&
          router.pathname == '/profile'
        ) {
          disconnect();
        }
        if (!isConnected) {
          console.log('Hi you are in connect if ');
          await connectAsync();
          await reFetechTokenAddress();
        }
        if (tokenAddress) {
          if (tokenAddress == EMPTY_BYTES) {
            router.push('/signup');
          } else {
            router.push('/profile');
          }
        } else {
          router.push('/signup');
        }
      }}
      color='brand.dark'
    >
      {getWalletAction()}
    </Button>
  );
}
const WalletConnect = chakra(WalletConnectMinimum);
export default WalletConnect;
