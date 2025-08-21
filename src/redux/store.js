import { configureStore } from '@reduxjs/toolkit';
import authUser from './authSlice'
import homePageSlice from './HomeSlice';
import globleSlice from './globleSlice';
import liveQuizeReducer from "./LiveQuizeSlice";

const store = configureStore({
    reducer: {
        authUser: authUser,
        home: homePageSlice,
        toggleSlice: globleSlice,
        liveQuize: liveQuizeReducer
    },
});

export default store;