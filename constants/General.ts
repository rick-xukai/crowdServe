/**
 * General constants
 */
import { isMobile } from 'react-device-detect';

import { Colors, Images } from '../theme';

export const Encrypt = 'encrypt';
export const Decrypt = 'decrypt';
export const DefaultPage = 1;
export const DefaultPageSize = isMobile && 10 || 12;
export const DefaultCrowdFundListPageSize = 10;
export const DefaultCodeRefreshTime = 30;
export const TokenExpire = 7 * 24 * 60 * 60 * 1000;
export const ListPageScrollDifference = 80;
export const PriceUnit = 'SGD';
export const PrivacyPolicyLink = 'https://docs.google.com/document/d/1M1ay69Paa9vi7YWTbKUawmn8cqOYROTNT3JnQ0MOMgg/mobilebasic';
export const TermsConditionsLink = 'https://docs.google.com/document/d/1kzJJhxsjlOtZW7s7OCbQVfDpBrUghrOl8ExbAs5QcBg/mobilebasic';
export const AppleStoreLink = 'https://apps.apple.com/us/app/crowdserve/id6444015643';
export const GooglePlayLink = 'https://play.google.com/store/apps/details?id=com.crowdserve.mobile';
export const AppLandingPage = 'https://app.ticket-crowdserve.com/landing-page';
export const AppHost = 'user.activated.cn';
export const PrimaryMarket = 'Primary Market';
export const PurchaseFromFan = 'Purchase From Fan';
export const MyTickets = 'My Tickets';
export const MyCollectibles = 'My Collectibles';
export const DifferentEmailErrorMessafe = 'Please log in with the email address used to purchase your ticket to view your ticket details.';
export const DefaultEventListBannerPageSize = 100;
export const CopyLink = 'Copy Link';
export const SaveImage = 'Save Image';
export const ShareEventLink = 'Join me at {eventName} by {OrganizerName}\n\ {currentLink}';
export const LinkCopied = 'Link copied.';
export const ImageSaved = 'Image saved.';
export const ImageSaveFailed = 'Image save failed.';
export const FirebaseEventEnv = process.env.NEXT_PUBLIC_FIREBASE_EVENT_ENV || '';
export const AppDomain = process.env.NEXT_PUBLIC_DOMAIN;

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
    bgColor: Colors.blueGray,
    color: Colors.white,
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
  norm: 'MMM dd yyyy, HH:mm',
  mdy: 'MMM dd, yyyy',
  hms: 'HH:mm:ss',
  hm: 'HH:mm',
};
export const CrowdFundStatus = {
  inProgress: 1,
  succeeded: 2,
  failed: 3,
};
