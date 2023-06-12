import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ActionStatus } from "@/types/common";

const initialState: {
  action: string;
  actionStatus: ActionStatus;
  pendingTxHash: string;
  actionError: any;
} = {
  action: "",
  actionStatus: ActionStatus.Initial,
  pendingTxHash: "",
  actionError: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setActionStatus: (state, action: PayloadAction<ActionStatus>) => {
      state.actionStatus = action.payload;
    },

    setPendingTxHash: (state, action: PayloadAction<string>) => {
      state.pendingTxHash = action.payload;
    },

    setActionError: (state, action: PayloadAction<any>) => {
      state.actionError = action.payload;
    },
  },
});

export const { setPendingTxHash, setActionStatus, setActionError } =
  modalSlice.actions;

export default modalSlice.reducer;
