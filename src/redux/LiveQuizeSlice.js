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

export const getMegaQuizAttendQuetionGetSlice = createAsyncThunk(
    'megaQuize/getMegaQuizAttendQuetionGetSlice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await liveQuizeTest.getMegaQuizAttendQuestion(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
export const megaQuizAttendSubmitSlice = createAsyncThunk(
    'megaQuize/megaQuizAttendSubmitSlice',
    async (megaQuizData, { rejectWithValue }) => {
        try {
            const response = await liveQuizeTest.megaQuizAttendSubmit(
                megaQuizData,
            );
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const megaQuizResultSlice = createAsyncThunk(
    'megaQuize/megaQuizResultSlice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await liveQuizeTest.megaQuizResult(id);
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