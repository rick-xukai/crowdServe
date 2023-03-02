const Messages = {
  success: {
    code: 200,
    text: 'Ticket is verified successfully!',
  },
  notFound: {
    code: 404,
    text: `User doesn't exist.`,
  },
  activateAccountUserDosentExist1001: {
    code: 1001,
    text: `User doesn't exist.`,
  },
  activateAccountUserDosentExist1002: {
    code: 1002,
    text: `User doesn't exist.`,
  },
  invalidPassword: {
    code: 1003,
    text: 'Wrong email or password.'
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
    text: 'user token is deprecated',
  },
  ticketSold: {
    code: 1017,
    text: 'Ticket already sold',
  },
  eventMismatch : {
    code: 1042,
    text: 'Invalid QR code, this ticket is not accessible for this event.'
  }
};

export default Messages;
