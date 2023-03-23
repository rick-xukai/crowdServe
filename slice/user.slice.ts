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
  type: number;
}

export interface RegisterAccountPayload {
  email: string;
  code: string;
  username: string;
  password: string;
  externalChannel?: string;
  externalId?: string;
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
 * RegisterAccount
 */
export const registerAccountAction = createAsyncThunk<
  LoginResponseType,
  RegisterAccountPayload,
  {
    rejectValue: ErrorType;
  }
>(
  'registerAccount/registerAccountAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doRegisterAccount(payload);
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

interface UserState {
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

const initialState: UserState = {
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

export const userSlice = createSlice({
  name: 'user',
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
      })
      .addCase(registerAccountAction.pending, (state) => {
        state.data = {} as LoginResponseType;
        state.loading = true;
      })
      .addCase(registerAccountAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(registerAccountAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset } = userSlice.actions;

export const selectLoading = (state: RootState) => state.user.loading;
export const selectError = (state: RootState) => state.user.error;
export const selectData = (state: RootState) => state.user.data;

export default userSlice.reducer;
