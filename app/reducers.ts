import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '../slice/user.slice';
import ticketsReducer from '../slice/tickets.slice';
import ticketsCacheSliceReducer from '../slice/ticketsCache.slice';
import eventSliceReducer from '../slice/event.slice';
import eventCacheSliceReducer from '../slice/eventCache.slice';
import crowdFundSliceReducer from '../slice/crowdFund.slice';
import crowdFundCacheSliceReducer from '../slice/crowdFundCache.slice';
import myTicketsSliceReducer from '../slice/myTickets.slice';
import myTicketsCacheSliceReducer from '../slice/myTicketsCache.slice';
import myCollectiblesSliceReducer from '../slice/myCollectibles.slice';
import myCollectiblesCacheSliceReducer from '../slice/myCollectiblesCache.slice';
import collectibleSliceReducer from '../slice/collectible.slice';
import qrCodeDataSliceReducer from '../slice/getQRCode.slice';
import collectionDetailCacheReducer from '../slice/collectionDetailCache.slice';
import pageTrackReducer from '../slice/pageTrack.slice';
import myRavesReducer from '../slice/myRaves.slice';
import raveReducer from '../slice/rave.slice';

const createRootReducer = () =>
  combineReducers({
    user: userReducer,
    tickets: ticketsReducer,
    ticketsCache: ticketsCacheSliceReducer,
    event: eventSliceReducer,
    eventCache: eventCacheSliceReducer,
    crowdFund: crowdFundSliceReducer,
    crowdFundCache: crowdFundCacheSliceReducer,
    myTickets: myTicketsSliceReducer,
    myTicketsCache: myTicketsCacheSliceReducer,
    myCollectibles: myCollectiblesSliceReducer,
    myCollectiblesCache: myCollectiblesCacheSliceReducer,
    collectible: collectibleSliceReducer,
    qrCodeData: qrCodeDataSliceReducer,
    collectionDetailCache: collectionDetailCacheReducer,
    pageTrack: pageTrackReducer,
    myRaves: myRavesReducer,
    rave: raveReducer,
  });

export default createRootReducer;
