export const LocalStorageKeys = {
  rememberMe: 'rememberMe',
  closeInstallAppTime: 'closeInstallAppTime',
  currentPageToSetting: 'currentPageToSetting',
};

export const CookieKeys = {
  authUser: 'authUser',
  userLoginToken: 'userLoginToken',
  userLoginEmail: 'userLoginEmail',
};

export const RouterKeys = {
  login: '/login',
  scanQrCode: '/scan-qr-code/:eventId',
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
};
