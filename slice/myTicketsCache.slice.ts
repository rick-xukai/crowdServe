import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { MyTicketsUserEventsResponseType } from './myTickets.slice';

/* eslint-disable no-param-reassign, complexity */

interface MyTicketsCacheState {
  myTicketsUserEventsForAll: MyTicketsUserEventsResponseType[];
  currentPage: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: MyTicketsCacheState = {
  myTicketsUserEventsForAll: [],
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const myTicketsCacheSlice = createSlice({
  name: 'myTicketsCache',
  initialState,
  reducers: {
    resetMyTicketsCache: () => initialState,
    resetMyTicketsRelatedState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    setMyTicketsUserEventsForAll: (state, action) => {
      state.myTicketsUserEventsForAll = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setIsDisableRequest: (state, action) => {
      state.isDisableRequest = action.payload;
    },
    setIsGetAllData: (state, action) => {
      state.isGetAllData = action.payload;
    },
    setScrollValue: (state, action) => {
      state.scrollValue = action.payload;
    },
  },
});

export const {
  resetMyTicketsCache,
  resetMyTicketsRelatedState,
  setMyTicketsUserEventsForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} = myTicketsCacheSlice.actions;

export const selectMyTicketsUserEventsForAll = (state: RootState) =>
  state.myTicketsCache.myTicketsUserEventsForAll;
export const selectCurrentPage = (state: RootState) =>
  state.myTicketsCache.currentPage;
export const selectIsDisableRequest = (state: RootState) =>
  state.myTicketsCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) =>
  state.myTicketsCache.isGetAllData;
export const selectScrollValue = (state: RootState) =>
  state.myTicketsCache.scrollValue;

export default myTicketsCacheSlice.reducer;
