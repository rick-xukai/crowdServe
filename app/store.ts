import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import createRootReducer from './reducers';

export const store = configureStore({
  reducer: createRootReducer(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
