import { safeIntToBigNumber } from '@/utils/converter';
import { useState } from 'react';
import { TokenFactoryAbi } from 'src/abi';
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import useGetTokenAddress from './useGetTokenAddress';

export default function (tokedId: number) {
  const [enable, setEnable] = useState(false);
  const [IsPublic, setIsPublic] = useState(false);
  const { tokenAddress } = useGetTokenAddress();
  const { config } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'setIsPublic',
    args: [safeIntToBigNumber(tokedId), IsPublic],
    enabled: enable,
  });
  const { data, writeAsync, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const changeIsPublic = (newIsPublic: boolean) => {
    setIsPublic(newIsPublic);
    setEnable(true);
  };
  return {
    config,
    changeIsPublic,
    writeAsync,
    write,
    isLoading,
    isSuccess,
  };
}
