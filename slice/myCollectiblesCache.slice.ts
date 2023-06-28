import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { MyCollectiblesListResponseType } from './myCollectibles.slice';

/* eslint-disable no-param-reassign, complexity */

interface MyCollectiblesCacheState {
  myCollectiblesListForAll: MyCollectiblesListResponseType[];
  currentPage: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: MyCollectiblesCacheState = {
  myCollectiblesListForAll: [],
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const myCollectiblesCacheSlice = createSlice({
  name: 'myCollectiblesCache',
  initialState,
  reducers: {
    resetMyCollectiblesCache: () => initialState,
    resetMyCollectiblesRelatedState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    setMyCollectiblesListForAll: (state, action) => {
      state.myCollectiblesListForAll = action.payload;
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
  resetMyCollectiblesCache,
  resetMyCollectiblesRelatedState,
  setMyCollectiblesListForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} = myCollectiblesCacheSlice.actions;

export const selectMyCollectiblesListForAll = (state: RootState) =>
  state.myCollectiblesCache.myCollectiblesListForAll;
export const selectCurrentPage = (state: RootState) =>
  state.myCollectiblesCache.currentPage;
export const selectIsDisableRequest = (state: RootState) =>
  state.myCollectiblesCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) =>
  state.myCollectiblesCache.isGetAllData;
export const selectScrollValue = (state: RootState) =>
  state.myCollectiblesCache.scrollValue;

export default myCollectiblesCacheSlice.reducer;
