import { createSlice } from "@reduxjs/toolkit";

import { fetchSpiceNfts, fetchCollections } from "./fetchGlobalNft";

interface WalletConnectState {
  allNfts: any[];
  collections: any[];
}

const initialState: WalletConnectState = {
  allNfts: [],
  collections: [],
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

    setCollections: (state, action) => {
      state.collections = action.payload.collections.map(
        (row: any, i: number) => ({
          ...row,
        })
      );
    },
  },
});

export const { reset, setAllNfts, setCollections } = nftSlice.actions;

export const fetchNftGlobalDataAsync = () => async (dispatch: any) => {
  const { nfts } = await fetchSpiceNfts();

  dispatch(
    setAllNfts({
      nfts,
    })
  );
};

export const fetchCollectionsGlobalDataAsync = () => async (dispatch: any) => {
  const { collections } = await fetchCollections();

  dispatch(
    setCollections({
      collections,
    })
  );
};

export default nftSlice.reducer;
