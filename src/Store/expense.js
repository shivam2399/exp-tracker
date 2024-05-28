// reducers/expenseReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialExpenseState = {
  items: [],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: initialExpenseState,
  reducers: {
    addExpense(state, action) {
      state.items.push(action.payload);
    },
    removeExpense(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setExpenses(state, action) {
      state.items = action.payload;
    },
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
