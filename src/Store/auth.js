import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  token: '',
  email: '',
  isLoggedIn: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.token = '';
      state.email = '';
      state.isLoggedIn = false;
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
