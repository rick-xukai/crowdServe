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
  password: string;
  code?: string;
  birthday?: string;
  genderId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneShortCode?: string;
}

export interface LoginResponseType {
  user: {
    userId: number;
    email: string;
  };
  token: string;
}

export interface ForgotPasswordResetPayload {
  email: string;
  code: string;
  password: string;
}

export interface VerifyUserPayload {
  email: string;
  firstName?: string;
  lastName?: string;
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
  birthday: string;
  genderId: string | null;
  country: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneShortCode: string;
  externalChannel?: string;
  externalId?: string;
  passwordConfirm?: string;
}

export interface UserGenderResponseType {
  id: number;
  label: string;
}

export interface ScannerLoginResponseType {
  token: string;
  user: {
    email: string;
    id: string;
    lastLoginAt: string;
    name: string;
    organizerId: number;
    role: number;
    status: number;
  };
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
>('login/loginAction', async (payload, { rejectWithValue }) => {
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
});

/**
 * Forgot Password Send Verification Code
 */
export const forgotPasswordSendVerificationCodeAction = createAsyncThunk<
  {},
  { email: string },
  {
    rejectValue: ErrorType;
  }
>(
  'forgotPasswordSendVerificationCode/forgotPasswordSendVerificationCodeAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doForgotPasswordSendVerificationCode(
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
 * Forgot Password Reset
 */
export const forgotPasswordResetAction = createAsyncThunk<
  {},
  ForgotPasswordResetPayload,
  {
    rejectValue: ErrorType;
  }
>(
  'forgotPasswordReset/forgotPasswordResetAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UserService.doForgotPasswordReset(payload);
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
 * get user gender
 */
export const getUserGenderAction = createAsyncThunk<
  UserGenderResponseType[],
  undefined,
  {
    rejectValue: ErrorType;
  }
>('getUserGender/getUserGenderAction', async (_, { rejectWithValue }) => {
  try {
    const response = await UserService.getUserGender();
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
});

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
  }
);

/**
 * Logout
 */
export const logoutAction = createAsyncThunk<{
  rejectValue: ErrorType;
}>('logout/logoutAction', async (_, { rejectWithValue }) => {
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
});

/**
 * verifyUser
 */
export const verifyUserAction = createAsyncThunk<
  {},
  VerifyUserPayload,
  {
    rejectValue: ErrorType;
  }
>('verifyUser/verifyUserAction', async (payload, { rejectWithValue }) => {
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
});

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
  }
);

/**
 * Scanner Login
 */
export const scannerLoginAction = createAsyncThunk<
  ScannerLoginResponseType,
  { email: string; password: string },
  {
    rejectValue: ErrorType;
  }
>('scannerLogin/scannerLoginAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await UserService.doScannerLogin(payload);
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
});

interface UserState {
  loading: boolean;
  scannerLoginLoading: boolean;
  scannerLoginResponse: ScannerLoginResponseType;
  getUserGenderLoading: boolean;
  forgotPasswordLoading: boolean;
  data: LoginResponseType;
  userGender: UserGenderResponseType[];
  loginRedirectPage: string;
  forgotPasswordError:
    | {
        code: number | undefined;
        message: string | undefined;
      }
    | undefined
    | null;
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
  scannerLoginLoading: false,
  scannerLoginResponse: {
    token: '',
    user: {
      email: '',
      id: '',
      lastLoginAt: '',
      name: '',
      organizerId: 0,
      role: 0,
      status: 0,
    },
  },
  forgotPasswordLoading: false,
  getUserGenderLoading: true,
  userGender: [],
  data: {
    user: {
      userId: 0,
      email: '',
    },
    token: '',
  },
  error: null,
  forgotPasswordError: null,
  loginRedirectPage: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.forgotPasswordLoading = false;
      state.getUserGenderLoading = true;
      state.userGender = [];
      state.data = {
        user: {
          userId: 0,
          email: '',
        },
        token: '',
      };
      state.error = null;
      state.forgotPasswordError = null;
    },
    resetLoginRedirectPage: (state) => {
      state.loginRedirectPage = '';
    },
    resetForgotPasswordValue: (state) => {
      state.forgotPasswordError = null;
      state.forgotPasswordLoading = false;
    },
    setLoginRedirectPage: (state, action) => {
      state.loginRedirectPage = action.payload;
    },
    resetScannerLoginResponse: (state) => {
      state.scannerLoginResponse = {
        token: '',
        user: {
          email: '',
          id: '',
          lastLoginAt: '',
          name: '',
          organizerId: 0,
          role: 0,
          status: 0,
        },
      };
    },
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
      .addCase(forgotPasswordSendVerificationCodeAction.pending, (state) => {
        state.forgotPasswordLoading = true;
      })
      .addCase(forgotPasswordSendVerificationCodeAction.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
      })
      .addCase(
        forgotPasswordSendVerificationCodeAction.rejected,
        (state, action) => {
          state.forgotPasswordLoading = false;
          if (action.payload) {
            state.forgotPasswordError = action.payload as ErrorType;
          } else {
            state.forgotPasswordError = action.error as ErrorType;
          }
        }
      )
      .addCase(forgotPasswordResetAction.pending, (state) => {
        state.forgotPasswordLoading = true;
      })
      .addCase(forgotPasswordResetAction.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
      })
      .addCase(forgotPasswordResetAction.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        if (action.payload) {
          state.forgotPasswordError = action.payload as ErrorType;
        } else {
          state.forgotPasswordError = action.error as ErrorType;
        }
      })
      .addCase(getUserGenderAction.pending, (state) => {
        state.userGender = [];
        state.getUserGenderLoading = true;
      })
      .addCase(getUserGenderAction.fulfilled, (state, action: any) => {
        state.getUserGenderLoading = false;
        state.userGender = action.payload;
      })
      .addCase(getUserGenderAction.rejected, (state, action) => {
        state.getUserGenderLoading = false;
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
        state.forgotPasswordLoading = true;
      })
      .addCase(verificationCodeAction.fulfilled, (state) => {
        state.loading = false;
        state.forgotPasswordLoading = false;
      })
      .addCase(verificationCodeAction.rejected, (state, action) => {
        state.loading = false;
        state.forgotPasswordLoading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
          state.forgotPasswordError = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
          state.forgotPasswordError = action.error as ErrorType;
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
      })
      .addCase(scannerLoginAction.pending, (state) => {
        state.scannerLoginResponse = {} as ScannerLoginResponseType;
        state.scannerLoginLoading = true;
      })
      .addCase(scannerLoginAction.fulfilled, (state, action: any) => {
        state.scannerLoginLoading = false;
        state.scannerLoginResponse = action.payload;
      })
      .addCase(scannerLoginAction.rejected, (state, action) => {
        state.scannerLoginLoading = false;
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
  resetForgotPasswordValue,
  setLoginRedirectPage,
  resetLoginRedirectPage,
  resetScannerLoginResponse,
} = userSlice.actions;

export const selectLoading = (state: RootState) => state.user.loading;
export const selectForgotPasswordLoading = (state: RootState) =>
  state.user.forgotPasswordLoading;
export const selectForgotPasswordError = (state: RootState) =>
  state.user.forgotPasswordError;
export const selectError = (state: RootState) => state.user.error;
export const selectData = (state: RootState) => state.user.data;
export const selectUserGender = (state: RootState) => state.user.userGender;
export const selectGetUserGenderLoading = (state: RootState) =>
  state.user.getUserGenderLoading;
export const selectLoginRedirectPage = (state: RootState) =>
  state.user.loginRedirectPage;
export const selectScannerLoginLoading = (state: RootState) =>
  state.user.scannerLoginLoading;
export const selectScannerLoginResponse = (state: RootState) =>
  state.user.scannerLoginResponse;

export default userSlice.reducer;
