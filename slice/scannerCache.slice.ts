import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import ScannerService from '@/services/API/Scanner/Scanner.service';
import { DefaultPage, DefaultPageSize } from '@/constants/General';
import { ScannerEventListProps } from './scanner.slice';

/* eslint-disable no-param-reassign, complexity */

interface ScannerCacheState {
  loading: boolean;
  scannerEventListForAll: ScannerEventListProps[];
  isGetAllData: boolean;
  page: number;
  size: number;
  isDisableRequest: boolean;
}

const initialState: ScannerCacheState = {
  loading: false,
  isGetAllData: false,
  page: DefaultPage,
  size: DefaultPageSize,
  isDisableRequest: false,
  scannerEventListForAll: [],
};

export const scannerCacheSlice = createSlice({
  name: 'scannerCache',
  initialState,
  reducers: {
    reset: () => initialState,
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setIsDisableRequest: (state, action) => {
      state.isDisableRequest = action.payload;
    },
    setIsGetAllData: (state, action) => {
      state.isGetAllData = action.payload;
    },
    setScannerEventListForAll: (state, action) => {
      state.scannerEventListForAll = action.payload;
    },
  },
});

export const {
  reset,
  setPage,
  setSize,
  setIsDisableRequest,
  setIsGetAllData,
  setScannerEventListForAll,
} = scannerCacheSlice.actions;

export const selectPage = (state: RootState) => state.scannerCache.page;
export const selectSize = (state: RootState) => state.scannerCache.size;
export const selectIsDisableRequest = (state: RootState) =>
  state.scannerCache.isDisableRequest;
export const selectLoadMoreLoading = (state: RootState) =>
  state.scannerCache.loading;
export const selectScannerEventListForAll = (state: RootState) =>
  state.scannerCache.scannerEventListForAll;
export const selectIsGetAllData = (state: RootState) =>
  state.scannerCache.isGetAllData;

export default scannerCacheSlice.reducer;
