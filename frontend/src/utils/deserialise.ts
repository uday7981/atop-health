import { BLOODGROUP, Doc_User, TokenAccessDetail, User } from '@/types/user';
import { parseBytes32String } from '@ethersproject/strings';

export const deserialiseUser = (data: any): User => {
  return {
    fullName: parseBytes32String(data[0]),
    age: parseInt(data[2].toString()) ? parseInt(data[2].toString()) : 0,
    address: data[1],
    bloodGroup: parseBytes32String(data[3]) as BLOODGROUP,
    allergies: parseBytes32String(data[4]),
    medication: parseBytes32String(data[5]),
    about: parseBytes32String(data[6]),
  };
};
export const deserialiseDoc = async (data: any): Promise<Doc_User> => {
  let response;
  let tokenDetailJson;
  try {
    response = await fetch(data[2]);
    tokenDetailJson = await response.json();
  } catch (err) {
    console.log(err);
  }
  console.log({ tokenDetailJson });

  if (tokenDetailJson) {
    return {
      title: tokenDetailJson['name'],
      name: tokenDetailJson['properties']['issuerName'],
      fileUrl: data[3],
      id: parseInt(data[1]),
      Tag: tokenDetailJson['description'],
      file: null,
      Date_of_Issued: new Date(tokenDetailJson['properties']['date']),
      Issued_By_Doctor: tokenDetailJson['properties']['doctor_issued_by'],
      Issued_By_Hospital: tokenDetailJson['properties']['hospital_issued_by'],
    };
  }
};

export const deserialiseTokenAccessDetail = (data: any): TokenAccessDetail => {
  return {
    is_public: Boolean(data[0]),
    price: parseInt(data[1].toString()),
    allowedAddresses: data[2] as string[],
  } as TokenAccessDetail;
};
