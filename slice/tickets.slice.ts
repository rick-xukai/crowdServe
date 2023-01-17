import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import TicketService from '../services/API/Ticket';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  message: string;
}

export interface GetTicketsListPayloadType {
  page?: number;
  size?: number;
  status?: number;
}

export interface TicketsListResponseType {
  id: number;
  name: string;
  organizerName: string;
  image: string;
  imageType: string;
  thumbnailUrl: string;
  thumbnailType: string;
  location: string;
  startTime: string;
  endTime: string;
  type: string;
  status: number;
}

/**
 * Login
 */
export const getTicketsListAction = createAsyncThunk<
  TicketsListResponseType[],
  GetTicketsListPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'getTicketsList/getTicketsListAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await TicketService.getTicketsList(payload);
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

interface TicketsState {
  loading: boolean;
  ticketsListData: TicketsListResponseType[];
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: TicketsState = {
  loading: false,
  ticketsListData: [],
  error: null,
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTicketsListAction.pending, (state) => {
        state.ticketsListData = [];
        state.loading = true;
      })
      .addCase(getTicketsListAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.ticketsListData = action.payload;
      })
      .addCase(getTicketsListAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = ticketsSlice.actions;

export const selectLoading = (state: RootState) => state.tickets.loading;
export const selectError = (state: RootState) => state.tickets.error;
export const selectTicketsListData = (state: RootState) => state.tickets.ticketsListData;

export default ticketsSlice.reducer;
