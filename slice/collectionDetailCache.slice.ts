import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { DefaultPage } from '../constants/General';
import { MyCollectiblesOrganizerTicketsType } from './myCollectibles.slice';

/* eslint-disable no-param-reassign, complexity */

interface CollectionDetailCacheState {
  collectiblesOrganizerTicketsForAll: MyCollectiblesOrganizerTicketsType[];
  currentPage: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: CollectionDetailCacheState = {
  collectiblesOrganizerTicketsForAll: [],
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const collectionDetailCacheSlice = createSlice({
  name: 'collectionDetailCache',
  initialState,
  reducers: {
    resetCollectionDetailCache: () => initialState,
    resetCollectionDetailRelatedState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    setCollectiblesOrganizerTicketsForAll: (state, action) => {
      state.collectiblesOrganizerTicketsForAll = action.payload;
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
  resetCollectionDetailCache,
  resetCollectionDetailRelatedState,
  setCollectiblesOrganizerTicketsForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
} = collectionDetailCacheSlice.actions;

export const selectCollectiblesOrganizerTicketsForAll = (state: RootState) =>
  state.collectionDetailCache.collectiblesOrganizerTicketsForAll;
export const selectCurrentPage = (state: RootState) =>
  state.collectionDetailCache.currentPage;
export const selectIsDisableRequest = (state: RootState) =>
  state.collectionDetailCache.isDisableRequest;
export const selectIsGetAllData = (state: RootState) =>
  state.collectionDetailCache.isGetAllData;
export const selectScrollValue = (state: RootState) =>
  state.collectionDetailCache.scrollValue;

export default collectionDetailCacheSlice.reducer;
