import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import liveQuizeTest from "../api/liveQuizeProvider";





export const getLiveQuizSlice = createAsyncThunk(
    'liveQuiz/getLiveQuiz',
    async (_, { rejectWithValue }) => {
        try {
            const response = await liveQuizeTest.getLiveQuiz();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

// Slice
const liveQuize = createSlice({
    name: 'liveQuizeSlice',
    initialState: {
        isSideBar: false
    },

    reducers: {
        
    }

}
);

export const { sidebarToggle } = liveQuize.actions;

export default liveQuize.reducer;