import { createSlice } from "@reduxjs/toolkit";

const adherenceSlice = createSlice({
  name: "adherence",
  initialState: {
    adherenceDataBoolean: false,
  },
  reducers: {
    setAdherenceDataBoolean(state, action) {
      state.adherenceDataBoolean = action.payload;
    },
  },
});

export const { setAdherenceDataBoolean } = adherenceSlice.actions;
export default adherenceSlice.reducer;
