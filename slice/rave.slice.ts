import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import RaveService from '@/services/API/Rave/Rave.service';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export enum RaveQuestType {
  JOIN = 0,
  SHARE = 1,
  INVITE = 2,
  BUYTICKET = 3,
}

export interface GetRaveResponseUserProps {
  flamePoint: number;
  inviteCode: string;
  joined: boolean;
}

export interface GetRaveResponseRewardListProps {
  id: string;
  name: string;
  image: string;
  milestone: number;
  stock: number;
  redeemed: boolean;
  img?: string;
}

export interface GetRaveResponseQuestProps {
  name: string;
  description: string;
  flamePoint: number;
  limitUser: number;
  getTimes: number;
  type: number;
}

export interface GetRaveResponseProps {
  name: string;
  description: string;
  status: number;
  joinedUsers: number;
  redeemedUsers: number;
  user: GetRaveResponseUserProps;
  reward: GetRaveResponseRewardListProps[];
  quest: GetRaveResponseQuestProps[];
  eventImage: string;
}

export interface JoinRaveResponse {
  flamePoint: number;
  inviteCode: string;
}

/**
 * get rave
 */
export const getRaveAction = createAsyncThunk<
  GetRaveResponseProps,
  string,
  {
    rejectValue: ErrorType;
  }
>('getRave/getRaveAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await RaveService.getRave(payload);
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
 * Join rave
 */
export const joinRaveAction = createAsyncThunk<
  JoinRaveResponse,
  { id: string; data: { inviteCode: string } },
  {
    rejectValue: ErrorType;
  }
>('joinRave/joinRaveAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await RaveService.joinRave(payload);
    if (verificationApi(response)) {
      return response.data || {};
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
 * Redeem Rave Reward
 */
export const redeemRaveRewardAction = createAsyncThunk<
  { code: number; message: string },
  { eventId: string; rewardId: string },
  {
    rejectValue: ErrorType;
  }
>(
  'redeemRaveReward/redeemRaveRewardAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await RaveService.redeemRaveReward(
        payload.eventId,
        payload.rewardId
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

interface RaveState {
  raveData: GetRaveResponseProps;
  loading: boolean;
  actionButtonLoading: boolean;
  redeemRewardLoading: boolean;
  joinRaveResponse: JoinRaveResponse;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: RaveState = {
  loading: false,
  actionButtonLoading: false,
  redeemRewardLoading: false,
  error: null,
  joinRaveResponse: {
    flamePoint: 0,
    inviteCode: '',
  },
  raveData: {
    name: '',
    description: '',
    status: 0,
    joinedUsers: 0,
    redeemedUsers: 0,
    user: {
      flamePoint: 0,
      inviteCode: '',
      joined: false,
    },
    reward: [],
    quest: [],
    eventImage: '',
  },
};

export const raveSlice = createSlice({
  name: 'rave',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(joinRaveAction.pending, (state) => {
        state.actionButtonLoading = true;
      })
      .addCase(joinRaveAction.fulfilled, (state, action) => {
        state.actionButtonLoading = false;
        state.joinRaveResponse = action.payload;
      })
      .addCase(joinRaveAction.rejected, (state, action) => {
        state.actionButtonLoading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(redeemRaveRewardAction.pending, (state) => {
        state.redeemRewardLoading = true;
      })
      .addCase(redeemRaveRewardAction.fulfilled, (state) => {
        state.redeemRewardLoading = false;
      })
      .addCase(redeemRaveRewardAction.rejected, (state, action) => {
        state.redeemRewardLoading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getRaveAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRaveAction.fulfilled, (state, action) => {
        state.loading = false;
        state.raveData = action.payload;
      })
      .addCase(getRaveAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = raveSlice.actions;

export const selectLoading = (state: RootState) => state.rave.loading;
export const selectActionButtonLoading = (state: RootState) =>
  state.rave.actionButtonLoading;
export const selectRedeemRewardLoading = (state: RootState) =>
  state.rave.redeemRewardLoading;
export const selectError = (state: RootState) => state.rave.error;
export const selectRaveData = (state: RootState) => state.rave.raveData;
export const selectJoinRaveResponse = (state: RootState) =>
  state.rave.joinRaveResponse;

export default raveSlice.reducer;
