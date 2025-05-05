import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  admin: Admin | null;
}

const initialState: AuthState = {
  admin: null,
};

interface Admin {
  email: string | null;
  token: string | null;
  expiresAt: number | null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAdmin: (
      state,
      action: PayloadAction<{ email: string; token: string; expiresAt: number }>
    ) => {
      state.admin = {
        email: action.payload.email,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
      };
    },
    logout(state) {
      state.admin = null;
    },
  },
});

export const { setAdmin, logout } = authSlice.actions;
export default authSlice.reducer;