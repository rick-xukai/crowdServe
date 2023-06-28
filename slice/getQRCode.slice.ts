import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import QRCodeService from '../services/API/QRCode';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

/**
 * Get QR Code Data
 */
export const getQRCodeDataAction = createAsyncThunk<
  string,
  { ticket: string; event: string | null },
  {
    rejectValue: ErrorType;
  }
>('getQRCodeData/getQRCodeDataAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await QRCodeService.getQRcodeData(payload);
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
});

interface QRCodeDataState {
  loading: boolean;
  data: string;
  error:
    | {
        code: number | undefined;
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: QRCodeDataState = {
  loading: true,
  error: null,
  data: '',
};

export const qrCodeDataSlice = createSlice({
  name: 'qrCodeData',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQRCodeDataAction.pending, (state) => {
        state.loading = true;
        state.data = '';
      })
      .addCase(getQRCodeDataAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getQRCodeDataAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = qrCodeDataSlice.actions;

export const selectLoading = (state: RootState) => state.qrCodeData.loading;
export const selectError = (state: RootState) => state.qrCodeData.error;
export const selectData = (state: RootState) => state.qrCodeData.data;

export default qrCodeDataSlice.reducer;
