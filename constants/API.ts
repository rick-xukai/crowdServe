export enum AuthorizationType {
  bearer = 'Bearer',
}

const API = {
  login: {
    post: '/api/v1/user/session',
  },
  getTicketsList: {
    get: '/api/v1/ticket',
  },
  verifyTicket: {
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/ticket/{redeem_code}',
  },
};

export default API;
