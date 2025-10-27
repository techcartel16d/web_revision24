import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AttemptedData from "../api/AttemtedData";


// Async Thunks getattemptedDataSlice
export const getattemptedData = createAsyncThunk(
  "getAttemptedTestData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AttemptedData.getAttemptedTestData();
   
      return response.data; // Should be array of magazines
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunks get Reset Test Slice Data
// ✅ Updated Redux Slice with proper token handling
export const getResetTestSliceData = createAsyncThunk(
  "getResetTestSliceData",
  async (testId, {rejectWithValue}) => {
    try {
      
      const res = await AttemptedData.getResetTestData(testId);
      console.log('Reset Test Data Slice Screen', res);
      return res;
    } catch(error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
