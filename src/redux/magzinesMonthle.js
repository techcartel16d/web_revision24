import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monthlyMagazinesProvider from "../api/monthlyMagazinesProvidee";





// Async Thunks getFreeQuizeSlice
export const getMonthlymagazine = createAsyncThunk(
  "monthlyMagazines/getMonthlymagazine",
  async (_, { rejectWithValue }) => {
    try {
      const response = await monthlyMagazinesProvider.monthlyMagazineGet();
      // console.log('magzineslice res',response.data);
      return response.data; // Should be array of magazines
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
















// Slice
const Monthlymagzines = createSlice({
  name: 'magzinesMonthly',
  initialState: {},
  reducers: {}
});


export const { } = Monthlymagzines.actions;

export default Monthlymagzines.reducer;