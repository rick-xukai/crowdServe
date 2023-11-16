export const LocalStorageKeys = {
  scannerLoginRememberMe: 'scannerLoginRememberMe',
  closeInstallAppTime: 'closeInstallAppTime',
  currentPageToSetting: 'currentPageToSetting',
  pageViewTrackKeys: 'pageViewTrackKeys',
  joinRavePopupKey: 'joinRavePopupKey',
  joinRaveNotLogin: 'joinRaveNotLogin',
  scannerSelectEvent: 'scannerSelectEvent',
};

export const SessionStorageKeys = {
  inviteCodeForRave: 'inviteCodeForRave',
  scannerSelectEvent: 'scannerSelectEvent',
};

export const CookieKeys = {
  scannerLoginToken: 'scannerLoginToken',
  scannerLoginUser: 'scannerLoginUser',
  authUser: 'authUser',
  userLoginToken: 'userLoginToken',
  userLoginEmail: 'userLoginEmail',
  userLoginId: 'userLoginId',
  appCallPlatform: 'appCallPlatform',
  appCallVersion: 'appCallVersion',
  userProfileInfo: 'userProfileInfo',
};

export const RouterKeys = {
  login: '/login',
  forgotPassword: '/forgot-password',
  scanQrCode: '/scan-verify/:eventId',
  scanLogin: '/scan-login',
  ticketsList: '/my',
  landingPage: '/landing-page',
  ticketDetail: '/my/tickets/:slug',
  maintenance: '/maintenance',
  eventList: '/events',
  eventDetail: '/events/:slug',
  myWallet: '/my-wallet',
  activateAccount: '/activate-account',
  activateAccountNormalFlow: '/activate-account-normal-flow',
  createAccount: '/create-account',
  crowdFundList: '/crowdfund',
  crowdFundDetail: '/crowdfund/:crowdFundId',
  pageNotFound: '/404',
  myTickets: '/upcoming-events',
  myTicketsEventDetail: '/upcoming-events/:slug',
  myCollectibles: '/all-tickets',
  collectionDetail: '/all-tickets/:slug',
  collectibleDetail: '/all-tickets/:orgname-slug/:slug',
  myRaves: '/my-raves',
  eventsScan: '/scan-event',
  profile: '/profile',
};
