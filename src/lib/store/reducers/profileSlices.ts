// store/reducers/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: { name: "", email: "" },
  reducers: {
    setProfile: (state, action) => action.payload,
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
