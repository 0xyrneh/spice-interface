import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchETHPrice } from "./fetchPrice";

const initialState = {
  ethPrice: 0,
};

export const oracleSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setETHPrice: (state, action: PayloadAction<number>) => {
      state.ethPrice = action.payload;
    },
  },
});

export const {
  setETHPrice,
} = oracleSlice.actions;

export const fetchETHPriceAsync = () => async (dispatch: any) => {
  const ethPrice = await fetchETHPrice();

  dispatch(setETHPrice(ethPrice));
}

export default oracleSlice.reducer;
