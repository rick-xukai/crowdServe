export enum AuthorizationType {
  bearer = 'Bearer',
}

const API = {
  login: {
    post: '/api/v1/user/session',
  },
  forgotPassword: {
    delete: '/api/v1/user/password',
    put: '/api/v1/user/password',
  },
  registerAccount: {
    post: '/api/v1/user',
  },
  getUserGender: {
    get: 'api/v1/user_gender',
  },
  verifyUser: {
    post: '/api/v1/user/status/verify',
  },
  verificationCode: {
    post: '/api/v1/user/verification',
  },
  logout: {
    delete: '/api/v1/user/session',
  },
  getTicketsList: {
    get: '/api/v1/ticket',
  },
  getTicketDetail: {
    get: '/api/v1/ticket/{ticketId}',
  },
  getTicketQrcode: {
    get: '/api/v1/ticket/{ticketId}/code',
  },
  verifyTicket: {
    post: '/admin/event/{eventId}/verify',
  },
  redeemTicket: {
    delete: '/admin/user/ticket/{redeem_code}',
  },
  checkEvent: {
    get: '/admin/event/{eventId}',
  },
  apiMaintenance: {
    get: '/maintenance',
  },
  getEventList: {
    get: '/api/v1/event',
  },
  getEventDetail: {
    get: '/api/v1/event/{eventId}',
  },
  getEventDetailTicketType: {
    get: '/api/v1/event/{eventId}/type',
  },
  getEventListBanner: {
    get: '/api/v1/banner',
  },
  getCrowdFundList: {
    get: '/api/v1/crowdfund',
  },
  getCrowdFundDetail: {
    get: '/api/v1/crowdfund/{id}',
  },
  getEventMarket: {
    get: '/api/v1/market',
  },
  getMyTicketsListUserEventsList: {
    get: '/api/v1/my/event',
  },
  getMyEventTicketList: {
    get: '/api/v1/my/event/{eventId}',
  },
  getMyEventTicketDetail: {
    get: '/api/v1/my/collectible/ticket/{userTicketId}',
  },
  getMyCollectiblesList: {
    get: '/api/v1/my/collectible',
  },
  getMyCollectiblesOrganizerTicketList: {
    get: '/api/v1/my/collectible/{organizerId}',
  },
  getMyCollectiblesOrganizerInfo: {
    get: '/api/v1/organizer/{organizerId}',
  },
  getConnectedEvents: {
    get: '/api/v1/collectible/ticket/{userTicketUuid}/privilege',
  },
  getQRcodeData: {
    get: '/api/v1/my/collectible/ticket/{userTicketUuid}/code',
  },
  getPriceChartData: {
    get: '/api/v1/collectible/ticket/{userTicketUuid}/price_chart',
  },
  logPageView: {
    post: '/api/v1/page_view',
  },
  myRaves: {
    get: '/api/v1/rave',
  },
  getRave: {
    get: '/api/v1/rave/{eventId}',
  },
  joinRave: {
    post: '/api/v1/rave/{eventId}',
  },
  redeemRaveReward: {
    post: '/api/v1/rave/{eventId}/reward/{rewardId}',
  },
  visitSharedLink: {
    post: '/api/v1/rave/{eventId}/shared',
  },
  getTransferDetailsByCode: {
    get: '/api/v1/transfer/{code}',
  },
  claimTransfer: {
    post: '/api/v1/transfer/{code}/claim',
  },
  scannerLogin: {
    post: '/scanner/session',
  },
  getScannerEventList: {
    get: '/scanner/event',
  },
  verifyScanCode: {
    post: '/scanner/verify',
  },
  redeemScanCode: {
    put: '/scanner/redeem/:redeemCode',
  },
  getLoginUserDetail: {
    get: '/api/v1/user',
  },
  updateLoginUserDetail: {
    put: '/api/v1/user',
  },
};

export default API;
