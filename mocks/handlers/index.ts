import { eventHandlers } from './events';
import { authHandlers } from './auth';
import { ticketHandlers } from './tickets';
import { raveHandlers } from './raves';
import { profileHandlers } from './profile';
import { crowdfundHandlers } from './crowdfund';
import { scannerHandlers } from './scanner';

export const handlers = [
  ...eventHandlers,
  ...authHandlers,
  ...ticketHandlers,
  ...raveHandlers,
  ...profileHandlers,
  ...crowdfundHandlers,
  ...scannerHandlers,
]; 