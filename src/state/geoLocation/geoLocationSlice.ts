import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { Geolocation } from "@/types/geolocation";
import { GEOLOCATION_API_URL, GEOLOCATION_BLACKLIST } from "@/config/constants";

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
    const res = await axios.get(GEOLOCATION_API_URL);

    if (res.status === 200) {
      dispatch(setGeolocation(res.data.country));
    }
  } catch (err: any) {
    console.log("Geolocation API call error:", err);
  }
};

export default geolocationSlice.reducer;
