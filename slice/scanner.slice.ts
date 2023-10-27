import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import ScannerService from '@/services/API/Scanner/Scanner.service';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface ScannerEventListProps {
  name: string;
  organizerName: string;
  time: string;
  uuid: string;
}

/**
 * Get scanner event list
 */
export const getScannerEventListAction = createAsyncThunk<
  ScannerEventListProps[],
  undefined,
  {
    rejectValue: ErrorType;
  }
>(
  'getScannerEventList/getScannerEventListAction',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ScannerService.getScannerEventList();
      if (verificationApi(response)) {
        return response.data;
      }
      return rejectWithValue({
        code: response.code,
        message: response.message,
      } as ErrorType);
    } catch (err: any) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        message: err.response,
      } as ErrorType);
    }
  }
);

interface CrowdFundState {
  loading: boolean;
  scannerEventList: ScannerEventListProps[];
  error:
    | {
        code: number | undefined;
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: CrowdFundState = {
  loading: true,
  scannerEventList: [],
  error: null,
};

export const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getScannerEventListAction.pending, (state) => {
        state.scannerEventList = [];
        state.loading = true;
      })
      .addCase(getScannerEventListAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.scannerEventList = action.payload;
      })
      .addCase(getScannerEventListAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset, resetError } = scannerSlice.actions;

export const selectLoading = (state: RootState) => state.scanner.loading;
export const selectError = (state: RootState) => state.scanner.error;
export const selectScannerEventList = (state: RootState) =>
  state.scanner.scannerEventList;

export default scannerSlice.reducer;
