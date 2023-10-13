import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '../app/store';
import { verificationApi } from '../utils/func';
import MyCollectiblesService from '../services/API/MyCollectibles';

/* eslint-disable no-param-reassign, complexity */

export interface ErrorType {
  code: number | undefined;
  message: string;
}

export interface GetMyCollectiblesListPayloadType {
  page?: number | null;
  size?: number | null;
}

export interface MyCollectiblesTickets {
  image: string;
  saleStatus: number;
  transferStatus: number;
}

export interface MyCollectiblesListResponseType {
  id: string;
  slug: string;
  name: string;
  description: string;
  banner: string;
  logo: string;
  owned: number;
  tickets: MyCollectiblesTickets[];
}

export interface MyCollectiblesOrganizerInfoType {
  id: string;
  name: string;
  banner: string;
  logo: string;
  description: string;
}

export interface MyCollectiblesOrganizerTicketsType {
  id: string;
  slug: string;
  name: string;
  image: string;
  status: number;
  saleStatus: number;
  transferStatus: number;
}

/**
 * Get My Collectibles List
 */
export const getMyCollectiblesListAction = createAsyncThunk<
  MyCollectiblesListResponseType[],
  GetMyCollectiblesListPayloadType,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyCollectiblesList/getMyCollectiblesListAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await MyCollectiblesService.getMyCollectiblesList(
        payload
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

/**
 * Get My Collectibles List Organizer Info
 */
export const getMyCollectiblesOrganizerInfoAction = createAsyncThunk<
  MyCollectiblesOrganizerInfoType[],
  string,
  {
    rejectValue: ErrorType;
  }
>(
  'getMyCollectiblesOrganizerInfo/getMyCollectiblesOrganizerInfoAction',
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await MyCollectiblesService.getMyCollectiblesOrganizerInfo(payload);
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
 * Get My Collectibles Organizer Tickets
 */
export const getMyCollectiblesOrganizerTicketsAction = createAsyncThunk<
  MyCollectiblesOrganizerTicketsType[],
  { id: string; page: number; size: number },
  {
    rejectValue: ErrorType;
  }
>(
  'getMyCollectiblesOrganizerTickets/getMyCollectiblesOrganizerTicketsAction',
  async (payload, { rejectWithValue }) => {
    try {
      const { page, size, id } = payload;
      const response =
        await MyCollectiblesService.getMyCollectiblesOrganizerTicketList(id, {
          page,
          size,
        });
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

interface MyCollectiblesState {
  loading: boolean;
  collectionDetailLoading: boolean;
  myCollectiblesListData: MyCollectiblesListResponseType[];
  myCollectiblesOrganizerInfo: MyCollectiblesOrganizerInfoType;
  myCollectiblesOrganizerTickets: MyCollectiblesOrganizerTicketsType[];
  error:
    | {
        code: number | undefined;
        message: string | undefined;
      }
    | undefined
    | null;
}

const initialState: MyCollectiblesState = {
  loading: true,
  collectionDetailLoading: true,
  error: null,
  myCollectiblesListData: [],
  myCollectiblesOrganizerTickets: [],
  myCollectiblesOrganizerInfo: {
    id: '',
    name: '',
    banner: '',
    logo: '',
    description: '',
  },
};

export const myCollectiblesSlice = createSlice({
  name: 'myCollectibles',
  initialState,
  reducers: {
    reset: () => initialState,
    resetError: (state) => {
      state.error = null;
    },
    resetMyCollectiblesListData: (state) => {
      state.myCollectiblesListData = [];
    },
    setCollectiblesOrganizerDetailLoading: (state, action) => {
      state.collectionDetailLoading = action.payload;
    },
    resetCollectiblesOrganizerTickets: (state) => {
      state.myCollectiblesOrganizerTickets = [];
    },
    resetCollectiblesOrganizerDetail: (state) => {
      state.myCollectiblesOrganizerInfo = {
        id: '',
        name: '',
        banner: '',
        logo: '',
        description: '',
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyCollectiblesListAction.pending, (state) => {
        state.myCollectiblesListData = [];
        state.loading = true;
      })
      .addCase(getMyCollectiblesListAction.fulfilled, (state, action: any) => {
        state.loading = false;
        state.myCollectiblesListData = action.payload;
      })
      .addCase(getMyCollectiblesListAction.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as ErrorType;
        } else {
          state.error = action.error as ErrorType;
        }
      })
      .addCase(getMyCollectiblesOrganizerInfoAction.pending, (state) => {
        state.myCollectiblesOrganizerInfo = {
          id: '',
          name: '',
          banner: '',
          logo: '',
          description: '',
        };
        state.collectionDetailLoading = true;
      })
      .addCase(
        getMyCollectiblesOrganizerInfoAction.fulfilled,
        (state, action: any) => {
          state.myCollectiblesOrganizerInfo = action.payload;
        }
      )
      .addCase(
        getMyCollectiblesOrganizerInfoAction.rejected,
        (state, action) => {
          state.collectionDetailLoading = false;
          if (action.payload) {
            state.error = action.payload as ErrorType;
          } else {
            state.error = action.error as ErrorType;
          }
        }
      )
      .addCase(getMyCollectiblesOrganizerTicketsAction.pending, (state) => {
        state.myCollectiblesOrganizerTickets = [];
      })
      .addCase(
        getMyCollectiblesOrganizerTicketsAction.fulfilled,
        (state, action: any) => {
          state.collectionDetailLoading = false;
          state.myCollectiblesOrganizerTickets = action.payload;
        }
      )
      .addCase(
        getMyCollectiblesOrganizerTicketsAction.rejected,
        (state, action) => {
          state.collectionDetailLoading = false;
          if (action.payload) {
            state.error = action.payload as ErrorType;
          } else {
            state.error = action.error as ErrorType;
          }
        }
      );
  },
});

export const {
  reset,
  resetError,
  resetMyCollectiblesListData,
  resetCollectiblesOrganizerDetail,
  setCollectiblesOrganizerDetailLoading,
  resetCollectiblesOrganizerTickets,
} = myCollectiblesSlice.actions;

export const selectLoading = (state: RootState) => state.myCollectibles.loading;
export const selectError = (state: RootState) => state.myCollectibles.error;
export const selectMyCollectiblesListData = (state: RootState) =>
  state.myCollectibles.myCollectiblesListData;
export const selectMyCollectiblesOrganizerInfo = (state: RootState) =>
  state.myCollectibles.myCollectiblesOrganizerInfo;
export const selectMyCollectiblesOrganizerTickets = (state: RootState) =>
  state.myCollectibles.myCollectiblesOrganizerTickets;
export const selectCollectionDetaiLoading = (state: RootState) =>
  state.myCollectibles.collectionDetailLoading;

export default myCollectiblesSlice.reducer;
