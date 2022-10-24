const Messages = {
  success: {
    code: 200,
    text: 'Ticket is verified successfully!',
  },
  invalid: {
    code: 1007 || 1008,
    text: 'Invalid QR code, please refresh the code and try again.',
  },
  redeemed: {
    code: 1009,
    text: 'This ticket has been verified at 2022/09/12 13:32:35',
  },
  networkError: {
    code: 1010,
    text: 'Network error, please try again.',
  },
};

export default Messages;
