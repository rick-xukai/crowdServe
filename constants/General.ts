/**
 * General constants
 */
import { Colors } from "../theme";

export const Encrypt = 'encrypt';
export const Decrypt = 'decrypt';
export const DefaultPage = 1;
export const DefaultPageSize = 10;
export const TokenExpire = 7 * 24 * 60 * 60 * 1000;
export const TicketStatus = [
  {
    text: 'UPCOMING',
    key: 0,
    bgColor: Colors.branding,
    color: Colors.white,
  },
  {
    text: 'USED',
    key: 1,
    bgColor: Colors.branding100,
    color: Colors.grayScale40,
  },
  {
    text: 'CANCELLED',
    key: 2,
    bgColor: Colors.grayScale40,
    color: Colors.grayScale50,
  },
  {
    text: 'EXPIRED',
    key: 3,
    bgColor: Colors.grayScale90,
    color: Colors.grayScale40,
  },
  {
    text: 'ON SALE',
    key: 4,
    bgColor: Colors.branding,
    color: Colors.white,
  },
  {
    text: 'SOLD',
    key: 5,
    bgColor: Colors.branding,
    color: Colors.white,
  },
];
export const FormatTimeKeys = {
  norm: 'MMM dd, yyyy HH:mm:ss',
  mdy: 'MMM dd, yyyy',
  hms: 'HH:mm:ss',
  hm: 'HH:mm',
};
