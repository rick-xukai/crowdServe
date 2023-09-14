import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import EventService from '../services/API/Event';
import { EventDetailDescriptionImages } from './myTickets.slice';
import { Rave } from '@/constants/General';

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

export interface GetEventMarketPayload {
  event: string;
  ticketType?: string;
  page?: number;
  size?: number;
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
  slug: string;
  address: string;
}

export interface EventListBanner {
  image: string;
  link: string;
}

export interface EventDetailResponseType {
  id: string;
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
  address: string;
  locationCoord: string;
  descriptionImages: EventDetailDescriptionImages[];
  refundPolicy: number;
  descriptionShort: string;
}

export interface EventTicketTypeResponseType {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  purchaseLimit: number;
  image: string;
  imageType: string;
  thumbnailUrl: string;
  thumbnailType: string;
  externalLink: string;
  blockchainUrl: string;
  onSale: boolean;
}

export interface EventMarketResponseType {
  id: string;
  name: string;
  organizerName: string;
  thumbnailUrl: string;
  thumbnailType: string;
  location: string;
  startTime: string;
  endTime: string;
  type: string;
  status: number;
  userName: string;
  currency: string;
  sellPrice: number;
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
>('getEventList/getEventListAction', async (payload, { rejectWithValue }) => {
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
});

/**
 * Get event detail
 */
export const getEventDetailAction = createAsyncThunk<
  EventDetailResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getEventDetail/getEventDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventDetail(payload);
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
 * Get event ticket type
 */
export const getEventTicketTypeAction = createAsyncThunk<
  EventListResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getEventTicketType/getEventTicketTypeAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventTicketType(payload);
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
 * Get event market
 */
export const getEventMarketAction = createAsyncThunk<
  EventMarketResponseType[],
  GetEventMarketPayload,
  {
    rejectValue: ErrorType;
  }
>(
  'getEventMarket/getEventMarketAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventMarket(payload);
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
 * Get event list banner
 */
export const getEventListBannerAction = createAsyncThunk<
  EventListBanner[],
  { page: number; size: number },
  {
    rejectValue: ErrorType;
  }
>(
  'getEventListBanner/getEventListBannerAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventListBanner(payload);
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

interface EventState {
  loading: boolean;
  eventDetailLoading: boolean;
  eventDetailData: EventDetailResponseType;
  eventListData: EventListResponseType[];
  eventTicketTypeData: EventTicketTypeResponseType[];
  eventListBanner: EventListBanner[];
  eventMarket: EventMarketResponseType[];
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
  tabActiveKey: string;
}

const initialState: EventState = {
  loading: true,
  eventDetailLoading: true,
  eventListData: [],
  eventTicketTypeData: [],
  eventListBanner: [],
  error: null,
  eventDetailError: null,
  eventDetailData: {
    id: "",
    name: "",
    organizerName: "",
    image: "",
    location: "",
    startTime: "",
    endTime: "",
    description: "",
    status: 0,
    crowdfundLink: "",
    slug: "",
    address: "",
    locationCoord: "",
    descriptionImages: [],
    refundPolicy: 0,
    descriptionShort: "",
  },
  eventMarket: [],
  tabActiveKey: Rave
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    reset: () => initialState,
    resetEventDatail: (state) => {
      state.eventDetailData = {
        id: "",
        name: "",
        organizerName: "",
        image: "",
        location: "",
        startTime: "",
        endTime: "",
        description: "",
        status: 0,
        crowdfundLink: "",
        slug: "",
        address: "",
        locationCoord: "",
        descriptionImages: [],
        refundPolicy: 0,
        descriptionShort: "",
      };
    },
    resetError: (state) => {
      state.error = null;
      state.eventDetailError = null;
    },
    resetEventListData: (state) => {
      state.eventListData = [];
    },
    resetEventDetailLoading: (state) => {
      state.eventDetailLoading = true;
    },
    setTabActiveKey: (state, action) => {
      state.tabActiveKey = action.payload;
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
      })
      .addCase(getEventDetailAction.pending, (state) => {
        state.eventDetailData = {} as EventDetailResponseType;
        state.eventDetailLoading = true;
      })
      .addCase(getEventDetailAction.fulfilled, (state, action: any) => {
        state.eventDetailData = action.payload;
      })
      .addCase(getEventDetailAction.rejected, (state, action) => {
        state.eventDetailLoading = false;
        if (action.payload) {
          state.eventDetailError = action.payload as ErrorType;
        } else {
          state.eventDetailError = action.error as ErrorType;
        }
      })
      .addCase(getEventTicketTypeAction.pending, (state) => {
        state.eventTicketTypeData = [];
        state.eventDetailLoading = true;
      })
      .addCase(getEventTicketTypeAction.fulfilled, (state, action: any) => {
        state.eventDetailLoading = false;
        state.eventTicketTypeData = action.payload;
      })
      .addCase(getEventTicketTypeAction.rejected, (state, action) => {
        state.eventDetailLoading = false;
        if (action.payload) {
          state.eventDetailError = action.payload as ErrorType;
        } else {
          state.eventDetailError = action.error as ErrorType;
        }
      })
      .addCase(getEventListBannerAction.pending, (state) => {
        state.eventListBanner = [];
      })
      .addCase(getEventListBannerAction.fulfilled, (state, action: any) => {
        state.eventListBanner = action.payload;
      })
      .addCase(getEventListBannerAction.rejected, (state, action) => {
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getEventMarketAction.pending, (state) => {
        state.eventMarket = [];
      })
      .addCase(getEventMarketAction.fulfilled, (state, action: any) => {
        state.eventMarket = action.payload;
      })
      .addCase(getEventMarketAction.rejected, (state, action) => {
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
  resetEventDatail,
  resetError,
  resetEventListData,
  resetEventDetailLoading,
  setTabActiveKey,
} = eventSlice.actions;

export const selectLoading = (state: RootState) => state.event.loading;
export const selectEventDetailLoading = (state: RootState) =>
  state.event.eventDetailLoading;
export const selectError = (state: RootState) => state.event.error;
export const selectEventListData = (state: RootState) =>
  state.event.eventListData;
export const selectEventTicketTypeData = (state: RootState) =>
  state.event.eventTicketTypeData;
export const selectEventDetailData = (state: RootState) =>
  state.event.eventDetailData;
export const selectEventDetailError = (state: RootState) =>
  state.event.eventDetailError;
export const selectEventListBanner = (state: RootState) =>
  state.event.eventListBanner;
export const selectEventMarket = (state: RootState) => state.event.eventMarket;
export const selectTabActiveKey = (state: RootState) => state.event.tabActiveKey;

export default eventSlice.reducer;
