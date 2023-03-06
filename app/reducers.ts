import { combineReducers } from '@reduxjs/toolkit';

import loginReducer from '../slice/login.slice';
import ticketsReducer from '../slice/tickets.slice';
import ticketsCacheSliceReducer from '../slice/ticketsCache.slice';

const createRootReducer = () => combineReducers({
  login: loginReducer,
  tickets: ticketsReducer,
  ticketsCache: ticketsCacheSliceReducer,
});

export default createRootReducer;
