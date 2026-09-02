
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserRole ="worker" | "landowner" | "authority";
interface AuthState {
  role: UserRole | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setAuth: (state,action: PayloadAction<{role: UserRole; }> ) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;

export default authSlice.reducer;