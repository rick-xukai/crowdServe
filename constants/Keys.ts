export const LocalStorageKeys = {
  rememberMe: 'rememberMe',
  closeInstallAppTime: 'closeInstallAppTime',
  currentPageToSetting: 'currentPageToSetting',
  pageViewTrackKeys: 'pageViewTrackKeys',
};

export const CookieKeys = {
  authUser: 'authUser',
  userLoginToken: 'userLoginToken',
  userLoginEmail: 'userLoginEmail',
  userLoginId: 'userLoginId',
};

export const RouterKeys = {
  login: '/login',
  forgotPassword: '/forgot-password',
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
  myTickets: '/my-tickets',
  myTicketsEventDetail: '/my-tickets/:slug',
  myCollectibles: '/my-collectibles',
  collectionDetail: '/my-collectibles/:slug',
  collectibleDetail: '/my-collectibles/:orgname-slug/:slug',
  myRaves: '/my-raves',
};
