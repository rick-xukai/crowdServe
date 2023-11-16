import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import ProfileService from '@/services/API/Profile/Profile.service';

/* eslint-disable no-param-reassign, complexity */

export const defaultProfileDetail = {
  id: 0,
  email: '',
  firstName: '',
  lastName: '',
  profileImage: '',
  phoneNumber: '',
  genderId: 0,
  genderLabel: '',
  birthday: '',
  country: '',
  isActivated: true,
  createdAt: '',
  phoneShortCode: '',
};

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface ProfileDetailProps {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  phoneNumber: string;
  genderId: number;
  genderLabel: string;
  birthday: string;
  country: string;
  isActivated: boolean;
  createdAt: string;
  phoneShortCode: string;
}

export interface UpdateProfileProps {
  firstName: string;
  lastName: string;
  profile: {
    filename: string;
    mimetype: string;
    buf: string;
  };
  phoneNumber: string;
  genderId: number;
  birthday: string;
  country: string;
  countryCode: string;
}

/**
 * Get login user profile detail
 */
export const getLoginUserDetailAction = createAsyncThunk<
  ProfileDetailProps,
  undefined,
  {
    rejectValue: ErrorType;
  }
>(
  'getLoginUserDetail/getLoginUserDetailAction',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ProfileService.getLoginUserDetail();
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
 * Update login user detail
 */
export const updateLoginUserDetailAction = createAsyncThunk<
  { code: number; message: string },
  FormData,
  {
    rejectValue: ErrorType;
  }
>(
  'updateLoginUserDetail/updateLoginUserDetailAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await ProfileService.updateLoginUserDetail(payload);
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

interface ProfileState {
  loading: boolean;
  defaultShowEditProfilePopup: boolean;
  updateProfileLoading: boolean;
  profileDetail: ProfileDetailProps;
  error:
    | {
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: ProfileState = {
  loading: true,
  defaultShowEditProfilePopup: false,
  updateProfileLoading: false,
  error: null,
  profileDetail: defaultProfileDetail,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    reset: () => initialState,
    setDefaultShowEditProfilePopup: (state, action) => {
      state.defaultShowEditProfilePopup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLoginUserDetailAction.pending, (state) => {
        state.profileDetail = defaultProfileDetail;
        state.loading = true;
      })
      .addCase(getLoginUserDetailAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.profileDetail = action.payload;
      })
      .addCase(getLoginUserDetailAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(updateLoginUserDetailAction.pending, (state) => {
        state.updateProfileLoading = true;
      })
      .addCase(updateLoginUserDetailAction.fulfilled, (state) => {
        state.updateProfileLoading = false;
      })
      .addCase(updateLoginUserDetailAction.rejected, (state, action) => {
        state.updateProfileLoading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      });
  },
});

export const { reset, setDefaultShowEditProfilePopup } = profileSlice.actions;

export const selectLoading = (state: RootState) => state.profile.loading;
export const selectUpdateProfileLoading = (state: RootState) =>
  state.profile.updateProfileLoading;
export const selectError = (state: RootState) => state.profile.error;
export const selectProfileDetail = (state: RootState) =>
  state.profile.profileDetail;
export const selectDefaultShowEditProfilePopup = (state: RootState) =>
  state.profile.defaultShowEditProfilePopup;

export default profileSlice.reducer;
