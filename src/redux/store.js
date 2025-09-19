import { configureStore } from '@reduxjs/toolkit';
import authUser from './authSlice'
import homePageSlice from './HomeSlice';
import globleSlice from './globleSlice';
import liveQuizeReducer from "./LiveQuizeSlice";
import freeTest from "./freeTestSlice";
import Monthlymagzines from "./magzinesMonthle";
import FreeQuizeSlice from "./freeQuizeSlice"

const store = configureStore({
    reducer: {
        authUser: authUser,
        home: homePageSlice,
        toggleSlice: globleSlice,
        liveQuize: liveQuizeReducer,
        monthlyMagazines: Monthlymagzines,
        getFreeQuizeData: FreeQuizeSlice,
        freeTest
    },
});

export default store;