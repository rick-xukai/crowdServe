import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import TicketService from '../services/API/Ticket';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
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

export interface TicketDetailResponseType {
  id: number;
  name: string;
  organizerName: string;
  description: string;
  image: string;
  imageType: string;
  thumbnailUrl: string;
  thumbnailType: string;
  location: string;
  startTime: string;
  endTime: string;
  type: string;
  seat: string;
  price: number;
  ticketNo: string;
  status: number;
  redeemedAt: string;
  cancelledAt: string;
  collections: {
    id: number;
    address: string;
  }[];
  canSell: boolean;
  crowdfundLink: string;
  eventId: number;
}

/**
 * Get tickets list
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

/**
 * Get ticket detail
 */
export const getTicketDetailAction = createAsyncThunk<
  TicketDetailResponseType,
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getTicketDetail/getTicketDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await TicketService.getTicketDetail(payload);
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

/**
 * Get ticket Qrcode
 */
export const getTicketQrcodeAction = createAsyncThunk<
  string,
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getTicketQrcode/getTicketQrcodeAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await TicketService.getTicketQrcode(payload);
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
        code: err.code,
        message: err.response,
      } as ErrorType);
    }
  },
);

interface TicketsState {
  loading: boolean;
  ticketDetailLoading: boolean;
  ticketsListData: TicketsListResponseType[];
  ticketDetailData: TicketDetailResponseType;
  ticketQrcodeData: string;
  qrcodeLoading: boolean;
  qrcodeError:
    | {
      code: number | undefined;
      message: string | undefined;
    }
    | undefined
    | null;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: TicketsState = {
  loading: true,
  ticketDetailLoading: true,
  ticketsListData: [],
  ticketDetailData: {
    id: 0,
    name: '',
    organizerName: '',
    description: '',
    image: '',
    imageType: '',
    thumbnailUrl: '',
    thumbnailType: '',
    location: '',
    startTime: '',
    endTime: '',
    type: '',
    seat: '',
    price: 0,
    ticketNo: '',
    status: 0,
    redeemedAt: '',
    cancelledAt: '',
    collections: [],
    canSell: true,
    crowdfundLink: '',
    eventId: 0,
  },
  ticketQrcodeData: '-',
  qrcodeLoading: true,
  qrcodeError: null,
  error: null,
};

export const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
    resetDetail: (state) => {
      state.error = null;
      state.qrcodeError = null;
      state.qrcodeLoading = true;
      state.ticketDetailLoading = true;
    },
    resetQrcodeError: (state) => {
      state.qrcodeError = null;
    },
    resetTicketsListData: (state) => {
      state.ticketsListData = [];
    },
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
      })
      .addCase(getTicketDetailAction.pending, (state) => {
        state.ticketDetailData = initialState.ticketDetailData;
        state.ticketDetailLoading = true;
      })
      .addCase(getTicketDetailAction.fulfilled, (state, action: any) => {
        state.ticketDetailLoading = false;
        state.ticketDetailData = action.payload;
      })
      .addCase(getTicketDetailAction.rejected, (state, action) => {
        state.ticketDetailLoading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getTicketQrcodeAction.pending, (state) => {
        state.ticketQrcodeData = initialState.ticketQrcodeData;
        state.qrcodeLoading = true;
        state.qrcodeError = undefined;
      })
      .addCase(getTicketQrcodeAction.fulfilled, (state, action: any) => {
        state.qrcodeLoading = false;
        state.ticketQrcodeData = action.payload;
        state.qrcodeError = undefined;
      })
      .addCase(getTicketQrcodeAction.rejected, (state, action) => {
        state.qrcodeLoading = false;
        if (action.payload) {
          state.qrcodeError = action.payload as ErrorType;
        } else {
          state.qrcodeError = action.error as ErrorType;
        }
      });
  },
});

export const {
  reset,
  resetDetail,
  resetQrcodeError,
  resetError,
  resetTicketsListData,
} = ticketsSlice.actions;

export const selectLoading = (state: RootState) => state.tickets.loading;
export const selectTicketDetailLoading = (state: RootState) => state.tickets.ticketDetailLoading;
export const selectError = (state: RootState) => state.tickets.error;
export const selectTicketsListData = (state: RootState) => state.tickets.ticketsListData;
export const selectTicketDetailData = (state: RootState) => state.tickets.ticketDetailData;
export const selectTicketQrcodeData = (state: RootState) => state.tickets.ticketQrcodeData;
export const selectQrcodeLoading = (state: RootState) => state.tickets.qrcodeLoading;
export const selectQrcodeError = (state: RootState) => state.tickets.qrcodeError;

export default ticketsSlice.reducer;
