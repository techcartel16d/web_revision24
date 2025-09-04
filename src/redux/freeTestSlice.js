import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import freeTestProvider from "../api/freeTestQuizProvider";





// Async Thunks getFreeQuizeSlice
export const getFreeQuizeSlice = createAsyncThunk(
    'freeTest/getFreeQuizeSlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await freeTestProvider.freeTestGet();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);


// Async Thunks getFreeTopicWisePaperSlice
export const getFreeTopicWisePaperSlice = createAsyncThunk(
    'freeTest/getFreeTopicWisePaperSlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await freeTestProvider.getTopicWisePaper();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// Async Thunks getFreeTopicWisePaperSlice
export const getAllPreviouseYearDataSlice = createAsyncThunk(
    'freeTest/getAllPreviouseYearDataSlice',
    async (page, { rejectWithValue }) => {
        try {
            const response = await freeTestProvider.getAllPreviouseYearData(page);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// Async Thunks 
export const getPreviouseYearGetQuestionSlice = createAsyncThunk(
    'freeTest/getPreviouseYearGetQuestionSlice',
    async (previousPaperId, { rejectWithValue }) => {
        try {
            const response = await freeTestProvider.getPreviouseYearPaperQuestionById(previousPaperId);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// Async Thunks attendPreviouseYearQuestionSlice
export const attendPreviouseYearQuestionSlice = createAsyncThunk(
  'user/attendPreviouseYearQuestionSlice',
  async (previouseYearSubmitData, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.attendPreviouseYearQuestions(
        previouseYearSubmitData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getPreviouseYearPaperRankSlice
export const getPreviouseYearPaperRankSlice = createAsyncThunk(
  'user/getPreviouseYearPaperRankSlice',
  async (previousPaperId, { rejectWithValue }) => {
    try {
      const response = await freeTestProvider.getPreviouseYearPaperRank(
        previousPaperId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Slice
const freeTestQuiz = createSlice({
    name: 'freeTestSlice',
    initialState: {},
    reducers: {}

}
);

export const { } = freeTestQuiz.actions;

export default freeTestQuiz.reducer;