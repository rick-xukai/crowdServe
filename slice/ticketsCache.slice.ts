import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { TicketsListResponseType } from './tickets.slice';

/* eslint-disable no-param-reassign, complexity */

interface TicketsCacheState {
  ticketsDataForAllStatus: TicketsListResponseType[];
  currentPage: number;
  requestStatusKey: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: TicketsCacheState = {
  ticketsDataForAllStatus: [],
  currentPage: DefaultPage,
  requestStatusKey: 0,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const ticketsCacheSlice = createSlice({
  name: 'ticketsCache',
  initialState,
  reducers: {
    resetTicketsCache: () => initialState,
    setTicketsDataForAllStatus: (state, action) => {
      state.ticketsDataForAllStatus = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setRequestStatusKey: (state, action) => {
      state.requestStatusKey = action.payload;
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
  resetTicketsCache,
  setTicketsDataForAllStatus,
  setCurrentPage,
  setRequestStatusKey,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} = ticketsCacheSlice.actions;

export const selectTicketsDataForAllStatus = (state: RootState) => state.ticketsCache.ticketsDataForAllStatus;
export const selectCurrentPage = (state: RootState) => state.ticketsCache.currentPage;
export const selectRequestStatusKey = (state: RootState) => state.ticketsCache.requestStatusKey;
export const selectIsDisableRequest = (state: RootState) => state.ticketsCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) => state.ticketsCache.isGetAllData;
export const selectScrollValue = (state: RootState) => state.ticketsCache.scrollValue;

export default ticketsCacheSlice.reducer;
