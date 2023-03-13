import CryptoJS from 'crypto-js';
import { format } from 'date-fns';

import Messages from '../constants/Messages';
import { Encrypt, TicketStatus, GooglePlayLink, AppHost } from '../constants/General';

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
  let formatData = '{}';
  try {
    if (type === Encrypt) {
      formatData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } else {
      formatData = CryptoJS.AES.decrypt(data, encryptionKey).toString(
        CryptoJS.enc.Utf8,
      );
    }
  } catch (_) {}
  return formatData;
};

export const formatTimeStrByTimeString = (
  timeString: string,
  formatType: string,
) => {
  try {
    if (timeString) {
      return format(new Date(timeString.replace(/-/g, '/')), formatType);
    }
  } catch (_) {}
  return '-';
};

export const checkStatusIcon = (key: number) => {
  return TicketStatus.find((item) => item.key === key)?.icon;
};

export const isEmail = (value: string) =>
  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{1,1})+([^<>()\.,;:\s@\"]{2,}))$/.test(
    value
  );

export const isPassword = (value: string) =>
  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  /^\S*(?=\S{8,})\S*$/.test(
    value
  );

export const getErrorMessage = (errorCode: number | undefined) => {
  let errorMessage = Messages.notFound.text;
  if (errorCode) {
    Object.values(Messages).forEach((item) => {
      if (errorCode === item.code) {
        errorMessage = item.text;
      }
    });
  }
  return errorMessage;
};

export const openApp = () => {
  const CallApp = require('callapp-lib');
  const options: any = {
    scheme: {
      protocol: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
      host: AppHost,
    },
    intent: {
      package: process.env.NEXT_PUBLIC_APP_PACKAGE_NAME_ANDROID,
      scheme: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
    },
    fallback: GooglePlayLink,
  };
  const callLib = new CallApp(options);
  callLib.open({ path: '' });
};

export const base64Decrypt = (code: string) => {
  const parsedWordArray = CryptoJS.enc.Base64.parse(code);
  const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
  return JSON.parse(parsedStr);
};
