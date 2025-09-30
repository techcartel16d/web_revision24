import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AttemptedData from "../api/AttemtedData";


// Async Thunks getattemptedDataSlice
export const getattemptedData = createAsyncThunk(
  "getAttemptedTestData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AttemptedData.getAttemptedTestData();
      console.log('Attempted Test Api Slice Data res',response.data);
      return response.data; // Should be array of magazines
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);