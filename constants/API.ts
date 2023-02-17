export enum AuthorizationType {
  bearer = 'Bearer',
}

const API = {
  login: {
    post: '/api/v1/user/session',
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
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/ticket/{redeem_code}',
  },
};

export default API;
