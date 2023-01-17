import { combineReducers } from '@reduxjs/toolkit';

import loginReducer from '../slice/login.slice';
import ticketsReducer from '../slice/tickets.slice';

const createRootReducer = () => combineReducers({
  login: loginReducer,
  tickets: ticketsReducer,
});

export default createRootReducer;
