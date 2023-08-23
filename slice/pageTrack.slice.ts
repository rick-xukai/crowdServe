import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '@/utils/func';
import PageTrackService from '@/services/API/PageTrack/PageTrack.service';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface LogPageViewProps {
  userId: number;
  session: string | null;
  pageType: number;
  platform: number;
  browser: string;
  operatingSys: string;
  deviceType: string;
  referer: string;
  timestamp: string;
  userTime: string;
  timezone: string;
  userAgent: string;
  coordinate?: string;
  objectId?: string;
  country?: string;
  userAddress?: string;
}

/**
 * Log page view
 */
export const logPageViewAction = createAsyncThunk<
  {},
  LogPageViewProps,
  {
    rejectValue: ErrorType;
  }
>('logPageView/logPageViewAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await PageTrackService.logPageView(payload);
    if (verificationApi(response)) {
      return response.data;
    }
    return rejectWithValue({
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

interface PageTrackState {
  loading: boolean;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: PageTrackState = {
  loading: true,
  error: null,
};

export const pageTrackSlice = createSlice({
  name: 'pageTrack',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(logPageViewAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(logPageViewAction.fulfilled, (state, action: any) => {
        state.loading = false;
      })
      .addCase(logPageViewAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = pageTrackSlice.actions;

export const selectLoading = (state: RootState) => state.pageTrack.loading;
export const selectError = (state: RootState) => state.pageTrack.error;

export default pageTrackSlice.reducer;
