import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import RaveService from '@/services/API/Rave/Rave.service';
import { Rave } from '@/constants/General';

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
  inviteCode: number;
  joined: boolean;
}

export interface GetRaveResponseRewardListProps {
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
  { code: number; message: string },
  string,
  {
    rejectValue: ErrorType;
  }
>('joinRave/joinRaveAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await RaveService.joinRave(payload);
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

interface RaveState {
  raveData: GetRaveResponseProps;
  loading: boolean;
  actionButtonLoading: boolean;
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
  error: null,
  raveData: {
    name: '',
    description: '',
    status: 0,
    joinedUsers: 0,
    redeemedUsers: 0,
    user: {
      flamePoint: 0,
      inviteCode: 0,
      joined: true,
    },
    reward: [],
    quest: [],
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
      .addCase(joinRaveAction.fulfilled, (state) => {
        state.actionButtonLoading = false;
      })
      .addCase(joinRaveAction.rejected, (state, action) => {
        state.actionButtonLoading = false;
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
export const selectError = (state: RootState) => state.rave.error;
export const selectRaveData = (state: RootState) => state.rave.raveData;

export default raveSlice.reducer;
