import { createSlice } from "@reduxjs/toolkit";

import { fetchSpiceNfts } from "./fetchGlobalNft";

interface WalletConnectState {
  allNfts: any[];
}

const initialState: WalletConnectState = {
  allNfts: [],
};

export const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    reset: (state) => {
      state.allNfts = [];
    },
    setAllNfts: (state, action) => {
      state.allNfts = action.payload.nfts.map((row: any, i: number) => ({
        ...row,
      }));
    },
  },
});

export const { reset, setAllNfts } = nftSlice.actions;

export const fetchNftGlobalDataAsync = () => async (dispatch: any) => {
  const { nfts } = await fetchSpiceNfts();

  dispatch(
    setAllNfts({
      nfts,
    })
  );
};

export default nftSlice.reducer;
