import { combineReducers } from '@reduxjs/toolkit';

import loginReducer from '../slice/login.slice';

const createRootReducer = () => combineReducers({
  login: loginReducer,
});

export default createRootReducer;
