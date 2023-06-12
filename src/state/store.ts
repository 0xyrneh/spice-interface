import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import vault from "./vault/vaultSlice";
import lend from "./lend/lendSlice";
import nft from "./nft/nftSlice";
import modal from "./modal/modalSlice";
import oracle from "./oracle/oracleSlice";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    vault,
    lend,
    nft,
    modal,
    oracle,
  },
  middleware: customizedMiddleware,
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
