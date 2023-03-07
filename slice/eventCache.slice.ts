import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { EventListResponseType } from './event.slice';

/* eslint-disable no-param-reassign, complexity */

interface EventCacheState {
  eventDataForAll: EventListResponseType[];
  currentPage: number;
  searchKeyword: string;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: EventCacheState = {
  eventDataForAll: [],
  searchKeyword: '',
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const eventCacheSlice = createSlice({
  name: 'eventCache',
  initialState,
  reducers: {
    resetEventCache: () => initialState,
    resetEventRelatedState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.searchKeyword = '';
    },
    setEventDataForAll: (state, action) => {
      state.eventDataForAll = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
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
  resetEventCache,
  setEventDataForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
  setSearchKeyword,
  resetEventRelatedState,
} = eventCacheSlice.actions;

export const selectEventDataForAll = (state: RootState) => state.eventCache.eventDataForAll;
export const selectCurrentPage = (state: RootState) => state.eventCache.currentPage;
export const selectSearchKeyword = (state: RootState) => state.eventCache.searchKeyword;
export const selectIsDisableRequest = (state: RootState) => state.eventCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) => state.eventCache.isGetAllData;
export const selectScrollValue = (state: RootState) => state.eventCache.scrollValue;

export default eventCacheSlice.reducer;
