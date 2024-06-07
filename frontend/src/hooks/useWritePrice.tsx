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
  const [price, setPrice] = useState(0);
  const { tokenAddress } = useGetTokenAddress();
  const { config } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: TokenFactoryAbi,
    functionName: 'setPrice',
    args: [safeIntToBigNumber(tokedId), safeIntToBigNumber(price)],
    enabled: enable,
  });
  const { data, writeAsync, write } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });
  const changePrice = (newPrice: number) => {
    setPrice(newPrice);
    setEnable(true);
  };
  return {
    config,
    changePrice,
    writeAsync,
    write,
    isLoading,
    isSuccess,
  };
}
