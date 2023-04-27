import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import CrowdFundService from '../services/API/CrowdFund';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface GetCrowdFundListPayloadType {
  page?: number | null;
  size?: number | null;
  keyword?: string;
}

export interface CrowdFundListResponseType {
  id: string;
  name: string;
  organizer: {
    name: string;
  };
  image: string;
  endTime: string;
  description: string;
  status: number;
  unitPrice: number;
  goalNumber: number;
  raisedNumber: number;
  externalLink: string;
  eventId: number;
}

export interface CrowdFundDetailResponseType {
  id: string;
  organizer: {
    name: string;
  };
  eventId: number;
  name: string;
  description: string;
  image: string;
  address: string;
  estimatedTime: string;
  externalLink: string;
  unitPrice: number;
  goalNumber: number;
  raisedNumber: number;
  endTime: string;
  status: number;
}

/**
 * Get crowd fund list
 */
export const getCrowdFundListAction = createAsyncThunk<
  CrowdFundListResponseType[],
  GetCrowdFundListPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'getCrowdFundList/getCrowdFundListAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CrowdFundService.getCrowdFundList(payload);
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
 * Get crowd fund detail
 */
export const getCrowdFundDetailAction = createAsyncThunk<
  CrowdFundDetailResponseType,
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getCrowdFundDetail/getCrowdFundDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await CrowdFundService.getCrowdFundDetail(payload);
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

interface CrowdFundState {
  loading: boolean;
  crowdFundDetailLoading: boolean;
  crowdFundListData: CrowdFundListResponseType[];
  crowdFundDetailData: CrowdFundDetailResponseType;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
  crowdFundDetailError:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: CrowdFundState = {
  loading: true,
  crowdFundDetailLoading: true,
  error: null,
  crowdFundDetailError: null,
  crowdFundListData: [],
  crowdFundDetailData: {
    id: '',
    organizer: {
      name: '',
    },
    eventId: 0,
    name: '',
    description: '',
    image: '',
    address: '',
    estimatedTime: '',
    externalLink: '',
    unitPrice: 0,
    goalNumber: 0,
    raisedNumber: 0,
    endTime: '',
    status: 0,
  },
};

export const crowdFundSlice = createSlice({
  name: 'crowdFund',
  initialState,
  reducers: {
    reset: () => initialState,
    resetDetail: (state) => {
      state.crowdFundDetailLoading = true;
      state.crowdFundDetailData = {
        id: '',
        organizer: {
          name: '',
        },
        eventId: 0,
        name: '',
        description: '',
        image: '',
        address: '',
        estimatedTime: '',
        externalLink: '',
        unitPrice: 0,
        goalNumber: 0,
        raisedNumber: 0,
        endTime: '',
        status: 0,
      };
      state.crowdFundDetailError = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetCrowdFundListData: (state) => {
      state.crowdFundListData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCrowdFundListAction.pending, (state) => {
        state.crowdFundListData = [];
        state.loading = true;
      })
      .addCase(getCrowdFundListAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.crowdFundListData = action.payload;
      })
      .addCase(getCrowdFundListAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getCrowdFundDetailAction.pending, (state) => {
        state.crowdFundDetailLoading = true;
      })
      .addCase(getCrowdFundDetailAction.fulfilled, (state, action: any) => {
        state.crowdFundDetailLoading = false;
        state.crowdFundDetailData = action.payload;
      })
      .addCase(getCrowdFundDetailAction.rejected, (state, action) => {
        state.crowdFundDetailLoading = false;
        if (action.payload) {
          state.crowdFundDetailError = action.payload as ErrorType;
        } else {
          state.crowdFundDetailError = action.error as ErrorType;
        }
      });
  },
});

export const { reset, resetError, resetCrowdFundListData, resetDetail } =
  crowdFundSlice.actions;

export const selectLoading = (state: RootState) => state.crowdFund.loading;
export const selectCrowdFundDetailLoading = (state: RootState) =>
  state.crowdFund.crowdFundDetailLoading;
export const selectError = (state: RootState) => state.crowdFund.error;
export const selectCrowdFundDetailError = (state: RootState) =>
  state.crowdFund.crowdFundDetailError;
export const selectCrowdFundListData = (state: RootState) =>
  state.crowdFund.crowdFundListData;
export const selectCrowdFundDetailData = (state: RootState) =>
  state.crowdFund.crowdFundDetailData;

export default crowdFundSlice.reducer;
