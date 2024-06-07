import { TokenAddressContext } from '@/providers/TokenAddressProvider';
import { useContext, useEffect } from 'react';
import { ParentStorageAbi } from 'src/abi';
import { PARENTCONTRACT } from 'src/data';
import { useAccount, useContractRead } from 'wagmi';

// interface UseUserDataType {
//     userData : User,
// }
export default function () {
  const { address } = useAccount();
  const { tokenAddress, setTokenAddress } = useContext(TokenAddressContext);
  const { data: tokenAddressWagmi, refetch } = useContractRead({
    address: PARENTCONTRACT,
    abi: ParentStorageAbi,
    functionName: 'accessMapping2',
    args: [address],
    watch: true,
    onSuccess(data) {
      console.log({ data });
    },
  });
  useEffect(() => {
    setTokenAddress(tokenAddressWagmi as string);
  }, [tokenAddressWagmi]);

  return { tokenAddress, refetch };
}
