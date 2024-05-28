import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import expenseReducer from './expense';
import themeReducer from './theme';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer
  },
});

export default store;
