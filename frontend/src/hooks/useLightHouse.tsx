import lighthouse from '@lighthouse-web3/sdk';
import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
interface IEncryptionSignature {
  signedMessage: string;
  publicKey: string;
}
export default function () {
  const { address } = useAccount();
  const [encryptionSignature, setEncryptionSignature] =
    useState<IEncryptionSignature>();
  const { data, error, isLoading, signMessage } = useSignMessage();
  const signInLighthouse = async () => {
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;

    signMessage({ message: messageRequested });
    console.log('sign message data', { data });
    setEncryptionSignature({
      signedMessage: data,
      publicKey: address,
    });
  };
  return {
    error,
    isLoading,
    signInLighthouse,
    signedMessage: encryptionSignature?.signedMessage,
    publicKey: encryptionSignature?.publicKey,
  };
}
