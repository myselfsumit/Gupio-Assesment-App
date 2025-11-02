import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  customerId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
}

const initialState: UserState = {
  customerId: null,
  email: null,
  name: null,
  phone: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ customerId: string }>) => {
      state.customerId = action.payload.customerId;
      // Email, name, and phone will be set later via profile update
      state.email = null;
      state.name = null;
      state.phone = null;
    },
    logout: (state) => {
      state.customerId = null;
      state.email = null;
      state.name = null;
      state.phone = null;
    },
    updateProfile: (state, action: PayloadAction<{ name?: string; email?: string; phone?: string }>) => {
      if (action.payload.name !== undefined) {
        state.name = action.payload.name;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      if (action.payload.phone !== undefined) {
        state.phone = action.payload.phone;
      }
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;

