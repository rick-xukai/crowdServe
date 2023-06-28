import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import MyTicketsService from '../services/API/MyTickets';
import CollectibleService from '../services/API/Collectible/Collectible.service';
import { CollectibleDetailResponseType } from './collectible.slice';

/* eslint-disable no-param-reassign, complexity */

const defaultMyTicketUserEventDetail = {
  id: 0,
  name: '',
  organizerName: '',
  image: '',
  location: '',
  startTime: '',
  endTime: '',
  description: '',
  status: 0,
  crowdfundLink: '',
  slug: '',
  organizerSlug: '',
};

const defaultMyEventTicketDetail = {
  id: '',
  name: '',
  organizerName: '',
  description: '',
  image: '',
  imageType: '',
  ticketNo: '',
  seat: 0,
  price: 0,
  status: 0,
  saleStatus: 0,
  organizerSlug: '',
  slug: '',
  event: {
    id: '',
    name: '',
    description: '',
    image: '',
    location: '',
    startTime: '',
    endTime: '',
    status: 0,
  },
  market: {
    currency: '',
    sellPrice: 0,
    soldAt: '',
    status: 0,
    createdAt: '',
  },
};

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface GetMyTicketsUserEventsPayloadType {
  page?: number | null;
  size?: number | null;
}

export interface MyTicketsUserEventsResponseType {
  id: string;
  name: string;
  description: string;
  organizerName: string;
  image: string;
  location: string;
  startTime: string;
  endTime: string;
  status: number;
  slug: string;
}

export interface MyTicketUserEventDetailResponseType {
  id: number;
  name: string;
  organizerName: string;
  image: string;
  status: number;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  crowdfundLink: string;
  slug: string;
  organizerSlug: string;
}

export interface MyEventTicketListResponseType {
  blockchainUrl: string;
  id: string;
  image: string;
  name: string;
  saleStatus: number;
  slug: string;
  organizerSlug: string;
  status: number;
  description: string;
  animationType: string;
  animationUrl: string;
  ticketNo?: string;
  price?: number;
  seat?: number;
}

export interface MyEventTicketDetailResponseType {
  id: string;
  name: string;
  organizerName: string;
  description: string;
  image: string;
  imageType: string;
  seat: number;
  price: number;
  status: number;
  saleStatus: number;
  ticketNo: string;
  organizerSlug: string;
  slug: string;
  event: {
    id: string;
    name: string;
    description: string;
    image: string;
    location: string;
    startTime: string;
    endTime: string;
    status: number;
  };
  market: {
    currency: string;
    sellPrice: number;
    soldAt: string;
    status: number;
    createdAt: string;
  };
}

/**
 * Get my tickets user event list
 */
export const getMyTicketsUserEventsAction = createAsyncThunk<
  MyTicketsUserEventsResponseType[],
  GetMyTicketsUserEventsPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyTicketsUserEvents/getMyTicketsUserEventsAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MyTicketsService.getMyTicketsListUserEventsList(
        payload
      );
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
  }
);

/**
 * Get my ticket user event detail
 */
export const getMyTicketUserEventDetailAction = createAsyncThunk<
  MyTicketUserEventDetailResponseType,
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyTicketUserEventDetail/getMyTicketUserEventDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MyTicketsService.getMyTicketUserEventDetail(
        payload
      );
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

/**
 * Get my event ticket list
 */
export const getMyEventTicketListAction = createAsyncThunk<
  MyEventTicketListResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyEventTicketList/getMyEventTicketListAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MyTicketsService.getMyEventTicketList(payload);
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
  }
);

/**
 * Get my event ticket detail
 */
export const getMyEventTicketDetailAction = createAsyncThunk<
  MyEventTicketListResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyEventTicketDetail/getMyEventTicketDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MyTicketsService.getMyEventTicketDetail(payload);
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
  }
);

/**
 * Get Collectible Detail
 */
export const getCollectibleDetailAction = createAsyncThunk<
  CollectibleDetailResponseType,
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getCollectibleDetail/getCollectibleDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CollectibleService.getCollectibleDetail(payload);
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

interface MyTicketsState {
  loading: boolean;
  eventDetailLoading: boolean;
  myTicketsUserEvents: MyTicketsUserEventsResponseType[];
  myTicketUserEventDetail: MyTicketUserEventDetailResponseType;
  myEventTicketList: MyEventTicketListResponseType[];
  myEventTicketDetail: MyEventTicketDetailResponseType;
  myEventTicketDetailLoading: boolean;
  eventDetailError:
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

const initialState: MyTicketsState = {
  loading: true,
  eventDetailLoading: true,
  myTicketsUserEvents: [],
  myEventTicketList: [],
  myEventTicketDetailLoading: true,
  myTicketUserEventDetail: defaultMyTicketUserEventDetail,
  error: null,
  eventDetailError: null,
  myEventTicketDetail: defaultMyEventTicketDetail,
};

export const myTicketsSlice = createSlice({
  name: 'myTickets',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
    resetMyTicketsListData: (state) => {
      state.myTicketsUserEvents = [];
    },
    resetMyTicketEventDetail: (state) => {
      state.eventDetailError = null;
      state.eventDetailLoading = true;
      state.myEventTicketDetailLoading = true;
      state.myEventTicketList = [];
      state.myEventTicketDetail = defaultMyEventTicketDetail;
      state.myTicketUserEventDetail = defaultMyTicketUserEventDetail;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTicketsUserEventsAction.pending, (state) => {
        state.myTicketsUserEvents = [];
        state.loading = true;
      })
      .addCase(getMyTicketsUserEventsAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.myTicketsUserEvents = action.payload;
      })
      .addCase(getMyTicketsUserEventsAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getMyTicketUserEventDetailAction.pending, (state) => {
        state.myTicketUserEventDetail =
          {} as MyTicketUserEventDetailResponseType;
        state.eventDetailLoading = true;
      })
      .addCase(
        getMyTicketUserEventDetailAction.fulfilled,
        (state, action: any) => {
          state.eventDetailLoading = false;
          state.myTicketUserEventDetail = action.payload;
        }
      )
      .addCase(getMyTicketUserEventDetailAction.rejected, (state, action) => {
        state.eventDetailLoading = false;
        if (action.payload) {
          state.eventDetailError = action.payload as ErrorType;
        } else {
          state.eventDetailError = action.error as ErrorType;
        }
      })
      .addCase(getMyEventTicketListAction.pending, (state) => {
        state.myEventTicketList = [];
      })
      .addCase(getMyEventTicketListAction.fulfilled, (state, action: any) => {
        state.myEventTicketList = action.payload;
      })
      .addCase(getMyEventTicketListAction.rejected, (state, action) => {
        if (action.payload) {
          state.eventDetailError = action.payload as ErrorType;
        } else {
          state.eventDetailError = action.error as ErrorType;
        }
      })
      .addCase(getMyEventTicketDetailAction.pending, (state) => {
        state.myEventTicketDetailLoading = true;
        state.myEventTicketDetail = {} as MyEventTicketDetailResponseType;
      })
      .addCase(getMyEventTicketDetailAction.fulfilled, (state, action: any) => {
        state.myEventTicketDetailLoading = false;
        state.myEventTicketDetail = action.payload;
      })
      .addCase(getMyEventTicketDetailAction.rejected, (state, action) => {
        state.myEventTicketDetailLoading = false;
        if (action.payload) {
          state.eventDetailError = action.payload as ErrorType;
        } else {
          state.eventDetailError = action.error as ErrorType;
        }
      });
  },
});

export const {
  reset,
  resetError,
  resetMyTicketsListData,
  resetMyTicketEventDetail,
} = myTicketsSlice.actions;

export const selectLoading = (state: RootState) => state.myTickets.loading;
export const selectEventDetailLoading = (state: RootState) =>
  state.myTickets.eventDetailLoading;
export const selectError = (state: RootState) => state.myTickets.error;
export const selectEventDetailError = (state: RootState) =>
  state.myTickets.eventDetailError;
export const selectTicketsUserEvents = (state: RootState) =>
  state.myTickets.myTicketsUserEvents;
export const selectTicketUserEventDetail = (state: RootState) =>
  state.myTickets.myTicketUserEventDetail;
export const selectMyEventTicketList = (state: RootState) =>
  state.myTickets.myEventTicketList;
export const selectMyEventTicketDetail = (state: RootState) =>
  state.myTickets.myEventTicketDetail;
export const selectMyEventTicketDetailLoading = (state: RootState) =>
  state.myTickets.myEventTicketDetailLoading;

export default myTicketsSlice.reducer;
