import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { CrowdFundListResponseType } from './crowdFund.slice';

/* eslint-disable no-param-reassign, complexity */

interface CrowdFundCacheState {
  crowdFundDataForAll: CrowdFundListResponseType[];
  currentPage: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: CrowdFundCacheState = {
  crowdFundDataForAll: [],
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const crowdFundCacheSlice = createSlice({
  name: 'crowdFundCache',
  initialState,
  reducers: {
    resetCrowdFundCache: () => initialState,
    resetCrowdFundRelatedState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    setCrowdFundDataForAll: (state, action) => {
      state.crowdFundDataForAll = action.payload;
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
  resetCrowdFundCache,
  resetCrowdFundRelatedState,
  setCrowdFundDataForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} = crowdFundCacheSlice.actions;

export const selectCrowdFundDataForAll = (state: RootState) => state.crowdFundCache.crowdFundDataForAll;
export const selectCurrentPage = (state: RootState) => state.crowdFundCache.currentPage;
export const selectIsDisableRequest = (state: RootState) => state.crowdFundCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) => state.crowdFundCache.isGetAllData;
export const selectScrollValue = (state: RootState) => state.crowdFundCache.scrollValue;

export default crowdFundCacheSlice.reducer;
