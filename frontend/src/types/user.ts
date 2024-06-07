import { BLOODGROUPS } from 'src/constants';
export type BLOODGROUP = (typeof BLOODGROUPS)[number];
export interface User {
  address: string;
  fullName: string;
  age: number;
  bloodGroup: BLOODGROUP;
  allergies: string;
  medication: string;
  about: string;
}
export interface Doc_User {
  title: string;
  Issued_By_Hospital: string;
  Issued_By_Doctor: string;
  Tag: string;
  Date_of_Issued: Date;
  file: File;
  fileUrl: string;
  id: number;
  name: string;
}
export interface MintParams {
  dataDescription: string;
  dataUrl: string;
}
export interface TokenAccessDetail {
  is_public: boolean;
  price: number;
  allowedAddresses: string[];
}
