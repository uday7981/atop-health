import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react';
import LoadingOverlay from 'react-loading-overlay';

type SpinnerContextType = {
  spinner: boolean;
  setSpinner: Dispatch<SetStateAction<boolean>>;
  spinnerText: string;
  setSpinnerText: Dispatch<SetStateAction<string>>;
};

export const SpinnerContext = createContext<SpinnerContextType>({
  spinner: false,
  setSpinner: () => {},
  spinnerText: '',
  setSpinnerText: () => {},
});

const SpinnerProvider = ({ children }: PropsWithChildren<{}>) => {
  const [spinner, setSpinner] = useState(false);
  const [spinnerText, setSpinnerText] = useState('');
  const value = useMemo<SpinnerContextType>(
    () => ({ spinner, setSpinner, spinnerText, setSpinnerText }),
    [spinner, spinnerText]
  );

  return (
    <SpinnerContext.Provider value={value}>
      <LoadingOverlay
        active={value.spinner}
        spinner={value.spinner}
        text={value.spinnerText}
      >
        {children}
      </LoadingOverlay>
    </SpinnerContext.Provider>
  );
};

export default SpinnerProvider;
