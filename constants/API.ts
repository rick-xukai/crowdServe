const API = {
  login: {
    post: '/api/v1/user/session',
  },
  verifyTicket: {
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/ticket/{redeem_code}',
  },
};

export default API;
