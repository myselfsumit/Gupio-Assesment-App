import { configureStore } from '@reduxjs/toolkit';
import parkingReducer from '../../src/features/parking/parkingSlice';
import authReducer from '../../src/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    parking: parkingReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


