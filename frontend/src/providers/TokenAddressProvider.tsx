import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

type TokenAddressContextType = {
  tokenAddress: string;
  setTokenAddress: Dispatch<SetStateAction<string>>;
};

export const TokenAddressContext = createContext<TokenAddressContextType>({
  tokenAddress: '',
  setTokenAddress: () => {},
});

const TokenAddressProvider = ({ children }: PropsWithChildren<{}>) => {
  const [tokenAddress, setTokenAddress] = useState<string>();
  const value = useMemo<TokenAddressContextType>(
    () => ({ tokenAddress, setTokenAddress }),
    [tokenAddress]
  );

  return (
    <TokenAddressContext.Provider value={value}>
      {children}
    </TokenAddressContext.Provider>
  );
};

export default TokenAddressProvider;
