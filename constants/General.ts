/**
 * General constants
 */
import { Colors, Images } from '../theme';

export const Encrypt = 'encrypt';
export const Decrypt = 'decrypt';
export const DefaultPage = 1;
export const DefaultPageSize = 10;
export const DefaultCodeRefreshTime = 30;
export const TokenExpire = 7 * 24 * 60 * 60 * 1000;
export const ListPageScrollDifference = 80;
export const PriceUnit = 'SGD';
export const PrivacyPolicyLink =
  'https://docs.google.com/document/d/1M1ay69Paa9vi7YWTbKUawmn8cqOYROTNT3JnQ0MOMgg/mobilebasic';
export const TermsConditionsLink =
  'https://docs.google.com/document/d/1kzJJhxsjlOtZW7s7OCbQVfDpBrUghrOl8ExbAs5QcBg/mobilebasic';
export const AppleStoreLink =
  'https://apps.apple.com/us/app/crowdserve/id6444015643';
export const GooglePlayLink =
  'https://play.google.com/store/apps/details?id=com.crowdserve.mobile';
export const AppLandingPage = 'https://app.ticket-crowdserve.com/landing-page';
export const AppHost = 'user.activated.cn';
export const PrimaryMarket = 'Primary Market';
export const PurchaseFromFan = 'Fan Resell';
export const Rave = 'Rave';
export const MyTickets = 'My Tickets';
export const MyEvents = 'My Events';
export const MyCollectibles = 'My Collectibles';
export const DifferentEmailErrorMessafe =
  'Please log in with the email address used to purchase your ticket to view your ticket details.';
export const DefaultEventListBannerPageSize = 100;
export const CopyLink = 'Copy Link';
export const SaveImage = 'Save Image';
export const ShareEventLink = `Can't wait for {eventName}! Join me by getting your tickets here.\n {currentLink}`;
export const ShareCollectibleLink =
  'Just bought {collectibleName}! Check it out at\n {currentLink}';
export const LinkCopied = 'Content copied.';
export const ImageSaved = 'Image saved.';
export const ImageSaveFailed = 'Image save failed.';
export const FirebaseEventEnv =
  process.env.NEXT_PUBLIC_FIREBASE_EVENT_ENV || '';
export const AppDomain = process.env.NEXT_PUBLIC_DOMAIN;
export const PasswordNotMatch = 'The passwords entered do not match.';
export const BirthdayNotVaild = 'Please enter a valid birthday.';
export const UserNotExist = `User doesn't exist`;
export const ActivateAccountFirst = 'Please activate your account first.';
export const AccountNotActivate =
  'Your account has not been activated yet. Please activate your account to continue.';
export const InviteVerifyType = 0;
export const RegisterVerifyType = 1;
export const ForgotPasswordVerifyType = 2;
export const VerificationCodeLength = 6;
export const ForgotPasswordAccountNotActivate =
  'forgotPasswordAccountNotActivate';
export const GoogleMapApiKeyDev = 'AIzaSyA2suiOjWXda3giLlDaKbH3XZh5rZtIoyU';
export const GoogleMapApiKeyProd = 'AIzaSyCqzVq-mo37n0jfbkNk7K17ELw939KC8cw';
export const RaveQuestShare = `Use the "Share the rave" button below. A referral link will be generated for you. You'll get rewarded everytime someone opens your link!`;
export const RaveQuestBuyTickets =
  'After a friend has joined the rave through your referral link, you get rewarded when they purchase a ticket for this event.';
export const RaveQuestInviteFriend = `Use the "Share the rave" button below. A referral link will be generated for you. You'll get rewarded for every friend that joins the rave through your link.`;
export const JoinedUserAvatar = ['K', 'B', 'C', 'S', 'D', 'J'];
export const RAVE_UPCOMING = 1091;
export const RAVE_ONGOING = 1092;
export const RAVE_ENDED = 1093;
export const RAVE_NOT_JOINED = 1094;
export const RAVE_REWARD_OUT_OF_STOCK = 1095;
export const RAVE_REWARD_ALREADY_REDEEMED = 1096;
export const RAVE_REWARD_FLAME_NOT_ENOUGH = 1097;
export const FirebaseTrackEventName = {
  eventDetailPageView: `webapp_event_detail_page_view${FirebaseEventEnv}`,
  joinRavePopupView: `webapp_join_rave_popup_view${FirebaseEventEnv}`,
  popupJoinRaveButtonClick: `webapp_popup_join_rave_button_click${FirebaseEventEnv}`,
  popupJoinRaveSuccess: `webapp_popup_join_rave_success${FirebaseEventEnv}`,
  popupJoinRaveFailed: `webapp_popup_join_rave_failed${FirebaseEventEnv}`,
  joinRaveButtonClick: `webapp_join_rave_button_click${FirebaseEventEnv}`,
  joinRaveSuccess: `webapp_join_rave_success${FirebaseEventEnv}`,
  joinRaveFailed: `webapp_join_rave_failed${FirebaseEventEnv}`,
  shareRaveButtonClick: `webapp_share_rave_button_click${FirebaseEventEnv}`,
};
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
export const EventStatus = [
  {
    text: 'UPCOMING',
    key: 1,
    bgColor: Colors.branding,
    color: Colors.white,
    icon: '',
  },
  {
    text: 'ENDED',
    key: 2,
    bgColor: Colors.blueGray,
    color: Colors.white,
    icon: '',
  },
  {
    text: 'CANCELLED',
    key: 3,
    bgColor: Colors.grayScale40,
    color: Colors.grayScale50,
    icon: '',
  },
];
export const TicketSaleStatus = {
  unsale: {
    status: 0,
    text: 'UNSALE',
  },
  onsale: {
    status: 1,
    text: 'ONSALE',
  },
  sold: {
    status: 2,
    text: 'SOLD',
  },
};
export const PrivilegeType = {
  event: {
    status: 0,
    text: 'EVENT',
  },
  discount: {
    status: 1,
    text: 'DISCOUNT',
  },
};
export const FormatTimeKeys = {
  norm: 'MMM dd yyyy, HH:mm',
  mdy: 'MMM dd, yyyy',
  hms: 'HH:mm:ss',
  hm: 'HH:mm',
  md: 'MMM dd',
};
export const CrowdFundStatus = {
  inProgress: 1,
  succeeded: 2,
  failed: 3,
};
export const DescriptionImagesSize = [
  {
    key: 8,
    text: 'small',
  },
  {
    key: 12,
    text: 'medium',
  },
  {
    key: 24,
    text: 'large',
  },
];
export enum SetRefundKey {
  refundable = 1,
  nonRefundable = 0,
}
export const DefaultPageType = 0;
export const DefaultPlatform = 0;
export const DefaultSelectCountry = 'Singapore';
export interface CountryItemProps {
  code: string;
  flag: string;
  shortCode: string;
  country: string;
}
