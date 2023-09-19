import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import MyRavesService from '../services/API/MyRaves';
import { RaveStatus } from './event.slice';
import { DefaultPage } from '@/constants/General';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}
export interface MyRavesItemType {
  eventId: string;
  eventSlug: string;
  name: string;
  description: string;
  status: RaveStatus;
  flamePoint: number;
}
/**
 * Get my raves
 */
export const getMyRavesAction = createAsyncThunk<
  MyRavesItemType[],
  { page: number; size: number },
  {
    rejectValue: ErrorType;
  }
>('myRaves/getMyRavesAction', async (payload, { rejectWithValue }) => {
  try {
    const response = await MyRavesService.getMyRaves(payload);
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

interface MyRavesState {
  myRavesLoading: boolean;
  myRavesError:
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
  myRaves: MyRavesItemType[];
  dataForAll: MyRavesItemType[];
  currentPage: number;
  isDisableRequest: boolean;
  isGetAllData: boolean;
  scrollValue: number;
}

const initialState: MyRavesState = {
  myRavesLoading: true,
  error: null,
  myRavesError: null,
  myRaves: [],
  dataForAll: [],
  currentPage: DefaultPage,
  isDisableRequest: false,
  isGetAllData: false,
  scrollValue: 0,
};

export const myRavesSlice = createSlice({
  name: 'myRaves',
  initialState,
  reducers: {
    reset: () => initialState,
    resetListData: (state) => {
      state.myRaves = [];
    },
    resetError: (state) => {
      state.error = null;
      state.myRavesError = null;
    },
    resetmyRavesLoading: (state) => {
      state.myRavesLoading = true;
    },
    resetMyRavesCache: (state) => {
      state.dataForAll = [];
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    resetMyRavesCacheState: (state) => {
      state.currentPage = DefaultPage;
      state.isDisableRequest = false;
      state.isGetAllData = false;
      state.scrollValue = 0;
    },
    setDataForAll: (state, action) => {
      state.dataForAll = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setIsDisableRequest: (state, action) => {
      state.isDisableRequest = action.payload;
    },
    setIsGetAllData: (state, action) => {
      state.isGetAllData = action.payload;
    },
    setScrollValue: (state, action) => {
      state.scrollValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyRavesAction.pending, (state) => {
        state.myRavesLoading = true;
      })
      .addCase(getMyRavesAction.fulfilled, (state, action: any) => {
        state.myRavesLoading = false;
        state.myRaves = action.payload;
      })
      .addCase(getMyRavesAction.rejected, (state, action) => {
        state.myRavesLoading = false;
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
  resetmyRavesLoading,
  resetMyRavesCache,
  resetMyRavesCacheState,
  setDataForAll,
  setCurrentPage,
  setIsDisableRequest,
  setIsGetAllData,
  setScrollValue,
  resetListData,
} = myRavesSlice.actions;

export const selectmyRavesLoading = (state: RootState) =>
  state.myRaves.myRavesLoading;
export const selectError = (state: RootState) => state.myRaves.error;
export const selectmyRavesData = (state: RootState) => state.myRaves.myRaves;

export const selectDataForAll = (state: RootState) => state.myRaves.dataForAll;
export const selectCurrentPage = (state: RootState) =>
  state.myRaves.currentPage;
export const selectIsDisableRequest = (state: RootState) =>
  state.myRaves.isDisableRequest;
export const selectIsGetAllData = (state: RootState) =>
  state.myRaves.isGetAllData;
export const selectScrollValue = (state: RootState) =>
  state.myRaves.scrollValue;

export default myRavesSlice.reducer;
