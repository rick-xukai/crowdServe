const Messages = {
  success: {
    code: 200,
    text: 'Ticket is verified successfully!',
  },
  invalidUnlawful: {
    code: 1007,
    text: 'Invalid QR code, please refresh the code and try again.',
  },
  invalidExpired: {
    code: 1008,
    text: 'Invalid QR code, please refresh the code and try again.',
  },
  redeemed: {
    code: 1009,
    text: 'This ticket has been verified at <br /> {redeemed_time}',
  },
  networkError: {
    code: 1010,
    text: 'Network error, please try again.',
  },
  userTokenDeprecated: {
    code: 1011,
    text: 'user token is deprecated',
  },
};

export default Messages;
