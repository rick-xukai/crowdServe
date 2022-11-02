const API = {
  verifyTicket: {
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/ticket/{redeem_code}',
  },
};

export default API;
