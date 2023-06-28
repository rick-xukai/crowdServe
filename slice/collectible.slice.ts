import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import CollectibleService from '../services/API/Collectible';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export const defaultCollectibleDetail = {
  name: '',
  organizerName: '',
  description: '',
  image: '',
  imageType: '',
  seat: 0,
  ticketNo: '',
  royaltiesFee: 0,
  ceilingPrice: 0,
  price: 0,
  sharePage: '',
  status: 0,
  saleStatus: 0,
  blockchainUrl: '',
  event: {
    id: '',
    slug: '',
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

export const defaultConnectedEventItem = {
  id: '',
  organizerName: '',
  event: {
    name: '',
    description: '',
    image: '',
    location: '',
    startTime: '',
    endTime: '',
  },
  ticketType: {
    name: '',
    image: '',
    imageType: '',
    thumbnailUrl: '',
    thumbnailType: '',
  },
  privilegeType: 0,
  externalLink: '',
  status: 0,
};

export interface CollectibleEventDetailResponseType {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  location: string;
  startTime: string;
  endTime: string;
  status: number;
}

export interface CollectibleDetailResponseType {
  name: string;
  organizerName: string;
  description: string;
  image: string;
  imageType: string;
  seat: number;
  ticketNo: string;
  royaltiesFee: number;
  ceilingPrice: number;
  price: number;
  sharePage: string;
  status: number;
  saleStatus: number;
  blockchainUrl: string;
  event: {
    id: string;
    slug: string;
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

export interface ConnectedEventsResponseType {
  id: string;
  organizerName: string;
  event: {
    name: string;
    description: string;
    image: string;
    location: string;
    startTime: string;
    endTime: string;
  };
  ticketType: {
    name: string;
    image: string;
    imageType: string;
    thumbnailUrl: string;
    thumbnailType: string;
    seat?: string;
    ticketNo?: string;
    price?: number;
  };
  privilegeType: number;
  externalLink: string;
  status: number;
}

export interface PriceChartResponseType {
  date: string;
  price: string;
}

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

/**
 * Get Connected Events
 */
export const getConnectedEventsAction = createAsyncThunk<
  ConnectedEventsResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getConnectedEvents/getConnectedEventsAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CollectibleService.getConnectedEvents(payload);
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
 * Get price chart data
 */
export const getPriceChartDataAction = createAsyncThunk<
  PriceChartResponseType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getPriceChartData/getPriceChartDataAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CollectibleService.getPriceChartData(payload);
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

interface CollectibleState {
  loading: boolean;
  priceChartData: PriceChartResponseType[];
  collectibleDetail: CollectibleDetailResponseType;
  connectedEvents: ConnectedEventsResponseType[];
  error:
    | {
        code: number | undefined;
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: CollectibleState = {
  loading: true,
  error: null,
  collectibleDetail: defaultCollectibleDetail,
  connectedEvents: [],
  priceChartData: [],
};

export const collectibleSlice = createSlice({
  name: 'collectible',
  initialState,
  reducers: {
    reset: () => initialState,
    setCollectibleDetailLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetCollectibleDetail: (state) => {
      state.connectedEvents = [];
      state.collectibleDetail = defaultCollectibleDetail;
      state.priceChartData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCollectibleDetailAction.pending, (state) => {
        state.collectibleDetail = defaultCollectibleDetail;
        state.loading = true;
      })
      .addCase(getCollectibleDetailAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.collectibleDetail = action.payload;
      })
      .addCase(getCollectibleDetailAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getConnectedEventsAction.pending, (state) => {
        state.connectedEvents = [];
      })
      .addCase(getConnectedEventsAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.connectedEvents = action.payload;
      })
      .addCase(getConnectedEventsAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getPriceChartDataAction.pending, (state) => {
        state.priceChartData = [];
      })
      .addCase(getPriceChartDataAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.priceChartData = action.payload;
      })
      .addCase(getPriceChartDataAction.rejected, (state, action) => {
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
  resetCollectibleDetail,
  setCollectibleDetailLoading,
} = collectibleSlice.actions;

export const selectLoading = (state: RootState) => state.collectible.loading;
export const selectError = (state: RootState) => state.collectible.error;
export const selectCollectibleDetail = (state: RootState) =>
  state.collectible.collectibleDetail;
export const selectConnectedEvents = (state: RootState) =>
  state.collectible.connectedEvents;
export const selectPriceChartData = (state: RootState) =>
  state.collectible.priceChartData;
export default collectibleSlice.reducer;
