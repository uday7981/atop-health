import { formatBytes32String } from '@ethersproject/strings';
import { BigNumber } from 'ethers';

export const safeStringToBytes32 = (str: string | undefined | null) =>
  str ? formatBytes32String(str) : formatBytes32String('');
export const safeIntToBigNumber = (int: number | null | undefined) =>
  int ? BigNumber.from(int) : BigNumber.from(0);
export const fileToBlob = async (file: File) =>
  new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });
export const getFileUrl = (cid: string) =>
  `https://gateway.lighthouse.storage/ipfs/${cid}`;
export const getMetaDataUrl = (cid: string) =>
  `https://${cid}.ipfs.nftstorage.link/metadata.json`;
export const getCidFromFileUrl = (url: string) => url.split('/')[4];
export const getViewUrlFromCid = (cid: string) =>
  `https://files.lighthouse.storage/viewFile/${cid}`;
export async function getMaxPriorityFeePerGas(provider) {
  // Blame FEVM
  let maxPriorityFee = null;
  let attempt = 0;
  while (maxPriorityFee == null) {
    try {
      return await provider.getFeeData().maxPriorityFeePerGas;
    } catch (e) {
      attempt++;
      if (attempt > 100) {
        break;
      }
    }
  }
  return 0;
}
