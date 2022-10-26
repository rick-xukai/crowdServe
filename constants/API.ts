const API = {
  verifyTicket: {
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/{userId}/ticket/{ticketId}',
  },
};

export default API;
