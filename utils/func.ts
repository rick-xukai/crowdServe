import CryptoJS from 'crypto-js';

import { Encrypt } from '../constants/General';

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

export const verificationApi = (response: any) => response.code === 200 && response.message === 'OK';

export const qs = <T extends { [k: string]: string | boolean }>(
  search: string = globalThis.location
    ? globalThis.location.search.slice(1)
    : '',
): Partial<T> =>
  search
    .split('&')
    .filter(Boolean)
    .reduce<any>((o, keyValue) => {
      const [key, value] = keyValue.split('=');

      if (value === undefined) o[key] = true;
      else o[key] = value;

      return o;
    }, {});

export const dataEncryption = (data: any, type: string) => {
  let formatData = '';
  if (type === Encrypt) {
    formatData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
  } else {
    formatData = CryptoJS.AES.decrypt(data, encryptionKey).toString(
      CryptoJS.enc.Utf8,
    );
  }
  return formatData;
};
