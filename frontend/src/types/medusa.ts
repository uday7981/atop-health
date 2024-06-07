import { HGamalEVMCipher as Ciphertext } from '@medusa-network/medusa-sdk';
import { BigNumber } from 'ethers';
export interface Listing {
  seller: string;
  cipherId: BigNumber;
  name: string;
  description: string;
  price: BigNumber;
  uri: string;
}

export interface Sale {
  buyer: string;
  seller: string;
  requestId: BigNumber;
  cipherId: BigNumber;
}

export interface Decryption {
  requestId: BigNumber;
  ciphertext: Ciphertext;
}
