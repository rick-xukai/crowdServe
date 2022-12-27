import { useCookies } from 'react-cookie';
import { Cookie, CookieSetOptions } from 'universal-cookie';

import { PREFIX } from '../constants/predicates';

export const useCookie = (cookiesArray: Array<string>) => {
  const newCookies = cookiesArray.map((item: string) => `${PREFIX}${item}`);
  const [cookies, setCookie, removeCookie] = useCookies(newCookies);
  const getCookie = (key: string): Cookie => cookies[`${PREFIX}${key}`];
  const setCookies = (
    key: string,
    value: Cookie,
    option?: CookieSetOptions,
  ): void => setCookie(`${PREFIX}${key}`, value, option);
  const removeCookies = (key: string, option?: CookieSetOptions): void =>
    removeCookie(`${PREFIX}${key}`, option);

  return {
    getCookie,
    setCookie: setCookies,
    removeCookie: removeCookies,
  };
};
