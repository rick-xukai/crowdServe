import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import EventService from '../services/API/Event';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface GetEventListPayloadType {
  page?: number | null;
  size?: number | null;
  keyword?: string;
}

export interface EventListResponseType {
  id: number;
  name: string;
  organizerName: string;
  image: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  status: number;
}

/**
 * Get event list
 */
export const getEventListAction = createAsyncThunk<
  EventListResponseType[],
  GetEventListPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'getEventList/getEventListAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventList(payload);
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
  },
);

interface EventState {
  loading: boolean;
  eventListData: EventListResponseType[];
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: EventState = {
  loading: true,
  eventListData: [],
  error: null,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
    resetEventListData: (state) => {
      state.eventListData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEventListAction.pending, (state) => {
        state.eventListData = [];
        state.loading = true;
      })
      .addCase(getEventListAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.eventListData = action.payload;
      })
      .addCase(getEventListAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const {
  reset,
  resetError,
  resetEventListData,
} = eventSlice.actions;

export const selectLoading = (state: RootState) => state.event.loading;
export const selectError = (state: RootState) => state.event.error;
export const selectEventListData = (state: RootState) => state.event.eventListData;

export default eventSlice.reducer;
