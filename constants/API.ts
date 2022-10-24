const API = {
  verifyTicket: {
    post: '/admin/ticket/verify',
  },
  redeemTicket: {
    delete: '/admin/user/{userId}/ticket/{ticketId}',
  },
  getTicketToken: {
    get: 'api/v1/ticket/1/code',
  }
};

export default API;
