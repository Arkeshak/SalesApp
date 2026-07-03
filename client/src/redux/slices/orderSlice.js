import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orderList: [],
  currentOrder: null,
};

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
});

export const { setOrderList, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
