import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../slice/user.slice';
import ticketsReducer from '../slice/tickets.slice';
import ticketsCacheSliceReducer from '../slice/ticketsCache.slice';
import eventSliceReducer from '../slice/event.slice';
import eventCacheSliceReducer from '../slice/eventCache.slice';
import crowdFundSliceReducer from '../slice/crowdFund.slice';
import crowdFundCacheSliceReducer from '../slice/crowdFundCache.slice';

const createRootReducer = () => combineReducers({
  user: userReducer,
  tickets: ticketsReducer,
  ticketsCache: ticketsCacheSliceReducer,
  event: eventSliceReducer,
  eventCache: eventCacheSliceReducer,
  crowdFund: crowdFundSliceReducer,
  crowdFundCache: crowdFundCacheSliceReducer,
});

export default createRootReducer;
