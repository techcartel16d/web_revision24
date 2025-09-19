import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FreeQuizeProvider from "../api/FreeQuizeProvider";






// Async Thunks getFreeQuizeSlice
export const getfreeQuizesData = createAsyncThunk(
  "getFreeQuizeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await FreeQuizeProvider.getFreeQuizeData();
      // console.log('magzineslice res',response.data);
      return response.data; // Should be array of magazines
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
















// Slice
const FreeQuizeSlice = createSlice({
  name: 'getFreeQuizeData',
  initialState: {},
  reducers: {}
});


export const { } = FreeQuizeSlice.actions;

export default FreeQuizeSlice.reducer;