import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import UserService from '../services/API/User';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  message: string;
}

export interface LoginPayloadType {
  email: string;
  code?: string;
  password: string;
}

export interface LoginResponseType {
  user: {
    userId: number;
    email: string;
  };
  token: string;
}

/**
 * Login
 */
export const loginAction = createAsyncThunk<
  LoginResponseType,
  LoginPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'login/loginAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doLogin(payload);
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
 * Logout
 */
export const logoutAction = createAsyncThunk<
  {
    rejectValue: ErrorType;
  }
>(
  'logout/logoutAction',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserService.doLogout();
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

interface LoginState {
  loading: boolean;
  data: LoginResponseType;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: LoginState = {
  loading: false,
  data: {
    user: {
      userId: 0,
      email: '',
    },
    token: '',
  },
  error: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending, (state) => {
        state.data = {} as LoginResponseType;
        state.loading = true;
      })
      .addCase(loginAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = loginSlice.actions;

export const selectLoading = (state: RootState) => state.login.loading;
export const selectError = (state: RootState) => state.login.error;
export const selectData = (state: RootState) => state.login.data;

export default loginSlice.reducer;
