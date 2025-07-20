import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import HomeProvider from '../api/homeProvider';

// Initial state
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    message: null,
    userInfo: {},
};



export const homePageSlice = createAsyncThunk(
    'homeSlice/homePageSlice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.homeData(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getSingleCategoryPackageTestseriesSlice = createAsyncThunk(
    'user/getSingleCategoryPackageTestseriesSlice',
    async ({ testId, page, search }, { rejectWithValue }) => {
        console.log('getSingleCategoryPackageTestseriesSlice', testId, page, search);
        try {
            const data = await HomeProvider.getSingleCategoryPackageTestseries(
                testId,
                page,
                search
            );
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// This thunk fetches the details of a specific test series based on the test ID
export const getSingleCategoryPackageTestseriesQuestionSlice = createAsyncThunk(
    'user/getSingleCategoryPackageTestseriesQuestionSlice',
    async (id, { rejectWithValue }) => {
        console.log("this is id", id)
        try {
            const data =await HomeProvider.getSingleCategoryPackageTestseriesQuestion(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);



const homeSlice = createSlice({
    name: 'homeSlice',
    initialState,
    reducers: {},
});

export const { } = homeSlice.actions;

export default homeSlice.reducer;