import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import UserService from '../services/API/User';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
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

export interface VerifyUserPayload {
  email: string;
}

export interface VerificationCodePayload {
  email: string;
  code: string;
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
  },
);

/**
 * verifyUser
 */
export const verifyUserAction = createAsyncThunk<
  {},
  VerifyUserPayload,
  {
    rejectValue: ErrorType;
  }
>(
  'verifyUser/verifyUserAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doVerifyUser(payload);
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
  },
);

/**
 * verificationCode
 */
export const verificationCodeAction = createAsyncThunk<
  {},
  VerificationCodePayload,
  {
    rejectValue: ErrorType;
  }
>(
  'verificationCode/verificationCodeAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doVerificationCode(payload);
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
  },
);

/**
 * verifyUser
 */
export const verifyUserAction = createAsyncThunk<
  {},
  VerifyUserPayload,
  {
    rejectValue: ErrorType;
  }
>(
  'verifyUser/verifyUserAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doVerifyUser(payload);
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
  },
);

/**
 * verificationCode
 */
export const verificationCodeAction = createAsyncThunk<
  {},
  VerificationCodePayload,
  {
    rejectValue: ErrorType;
  }
>(
  'verificationCode/verificationCodeAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doVerificationCode(payload);
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
  },
);

interface LoginState {
  loading: boolean;
  data: LoginResponseType;
  error:
    | {
        code: number | undefined;
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
      })
      .addCase(verifyUserAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyUserAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(verificationCodeAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(verificationCodeAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verificationCodeAction.rejected, (state, action) => {
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
