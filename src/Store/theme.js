import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkTheme: false,
  },
  reducers: {
    toggleTheme(state) {
      state.isDarkTheme = !state.isDarkTheme;
    },
    setDarkTheme(state) {
      state.isDarkTheme = true;
    },
    setLightTheme(state) {
      state.isDarkTheme = false;
    }
  }
});

export const themeActions = themeSlice.actions;
export default themeSlice.reducer;
