/**
 * General constants
 */
import { Colors, Images } from "../theme";

export const Encrypt = 'encrypt';
export const Decrypt = 'decrypt';
export const DefaultPage = 1;
export const DefaultPageSize = 10;
export const DefaultCodeRefreshTime = 30;
export const TokenExpire = 7 * 24 * 60 * 60 * 1000;
export const PriceUnit = 'SGD';
export const PrivacyPolicyLink = 'https://docs.google.com/document/d/1M1ay69Paa9vi7YWTbKUawmn8cqOYROTNT3JnQ0MOMgg/mobilebasic';
export const TermsConditionsLink = 'https://docs.google.com/document/d/1kzJJhxsjlOtZW7s7OCbQVfDpBrUghrOl8ExbAs5QcBg/mobilebasic';
export const AppleStoreLink = 'https://apps.apple.com/us/app/crowdserve/id6444015643';
export const GooglePlayLink = 'https://play.google.com/store/apps/details?id=com.crowdserve.mobile';
export const AppLandingPage = 'https://app.ticket-crowdserve.com/landing-page';
export const TicketStatus = [
  {
    text: 'UPCOMING',
    key: 0,
    bgColor: Colors.branding,
    color: Colors.white,
    icon: '',
  },
  {
    text: 'USED',
    key: 1,
    bgColor: Colors.branding100,
    color: Colors.grayScale40,
    icon: '',
  },
  {
    text: 'CANCELLED',
    key: 2,
    bgColor: Colors.grayScale40,
    color: Colors.grayScale50,
    icon: '',
  },
  {
    text: 'EXPIRED',
    key: 3,
    bgColor: Colors.grayScale90,
    color: Colors.grayScale40,
    icon: '',
  },
  {
    text: 'UPCOMING',
    key: 4,
    bgColor: Colors.branding,
    color: Colors.white,
    icon: Images.OnSaleIcon,
  },
  {
    text: '',
    key: 5,
    bgColor: Colors.branding,
    color: Colors.white,
    icon: Images.SoldIcon,
  },
];
export const FormatTimeKeys = {
  norm: 'MMM dd, yyyy HH:mm',
  mdy: 'MMM dd, yyyy',
  hms: 'HH:mm:ss',
  hm: 'HH:mm',
};
