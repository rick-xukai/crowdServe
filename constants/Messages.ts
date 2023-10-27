const Messages = {
  success: {
    code: 200,
    text: 'Ticket is verified successfully!',
  },
  apiError: {
    code: 500,
    text: 'Network Error.',
  },
  requestFailed: {
    code: 'ERR_NETWORK',
    text: 'Network Error.',
  },
  notFound: {
    code: 404,
    text: `Email address not found. Please check your email address or create a new account.`,
  },
  forbidden: {
    code: 403,
    text: 'Forbidden',
  },
  activateAccountUserDosentExist1001: {
    code: 1001,
    text: `Email address not found. Please check your email address or create a new account.`,
  },
  activateAccountUserDosentExist1002: {
    code: 1002,
    text: `Email address not found. Please check your email address or create a new account.`,
  },
  invalidPassword: {
    code: 1003,
    text: 'Wrong email or password.',
  },
  invalidActivationCode: {
    code: 1004,
    text: 'Invalid verification code.',
  },
  activateAccountUserAlreadyExist: {
    code: 1005,
    text: 'Account already exists, please login.',
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
    text: 'User token is deprecated, please login again',
  },
  ticketCancelled: {
    code: 1014,
    text: 'Ticket cancelled',
  },
  ticketOnSale: {
    code: 1016,
    text: 'Ticket is on sale',
  },
  ticketSold: {
    code: 1017,
    text: 'Ticket already sold',
  },
  eventMismatch: {
    code: 1042,
    text: 'Invalid QR code, this ticket is not accessible for this event.',
  },
  alreadyUserGoogleRegister: {
    code: 1043,
    text: 'This email address has been registered via a Google account. Please log in with your Google account or use a different email address to create a new account.',
  },
  continueToRegister: {
    code: 1044,
    text: '',
  },
};

export default Messages;
