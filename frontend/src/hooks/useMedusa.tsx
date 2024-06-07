import { MedusaContext } from '@/providers/MedusaProvider';
import { Medusa } from '@medusa-network/medusa-sdk';
import { useContext, useEffect } from 'react';
import { MEDUSAORACLEADDRESS } from 'src/data';
import { useAccount, useSigner } from 'wagmi';

export default function () {
  const { medusa, updateMedusa, decryptions } = useContext(MedusaContext);
  const { data: signer } = useSigner({});
  const { address } = useAccount();
  const signInToMedusa = async () => {
    if (!signer) return;

    const currentMedusa = await Medusa.init(MEDUSAORACLEADDRESS, signer);
    console.log({ currentMedusa });
    await currentMedusa.signForKeypair();
    updateMedusa(currentMedusa);
  };
  const signOutMedusa = async () => {
    medusa.setKeypair(null);
  };
  useEffect(() => {
    if (!medusa) {
      signInToMedusa();
    }
  }, []);
  return {
    medusa,
    signInToMedusa,
    signOutMedusa,
    decryptions,
  };
}
