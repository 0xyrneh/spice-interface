import { createSlice } from "@reduxjs/toolkit";

import { Geolocation } from "@/types/geolocation";
import { checkIfBlocked } from "@/utils";
import { GEOLOCATION_BLACKLIST } from "@/config/constants";

const initialState: Geolocation = {
  geolocation: "",
  isBlocked: undefined,
};

export const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    setGeolocation: (state, action) => {
      const location = action.payload;

      state.geolocation = location;
      if (location) {
        state.isBlocked = GEOLOCATION_BLACKLIST.includes(location);
      }
    },
  },
});

export const { setGeolocation } = geolocationSlice.actions;

export const fetchGeolocation = () => async (dispatch: any) => {
  try {
    const location = await checkIfBlocked();
    dispatch(setGeolocation(location));
  } catch (err: any) {
    console.log("Geolocation API call error:", err);
  }
};

export default geolocationSlice.reducer;
