import { configureStore } from '@reduxjs/toolkit';
import authUser from './authSlice'
import homePageSlice from './HomeSlice';
import globleSlice from './globleSlice';
import liveQuizeReducer from "./LiveQuizeSlice";
import freeTest from "./freeTestSlice";
import Monthlymagzines from "./magzinesMonthle";
import FreeQuizeSlice from "./freeQuizeSlice";
import doubtSolutionReducer from './doubtSolutionSlice'; // ✅ Add this import

const store = configureStore({
    reducer: {
        authUser: authUser,
        home: homePageSlice,
        toggleSlice: globleSlice,
        liveQuize: liveQuizeReducer,
        monthlyMagazines: Monthlymagzines,
        getFreeQuizeData: FreeQuizeSlice,
        freeTest,
        doubtSolution: doubtSolutionReducer, // ✅ Add this reducer
    },
    // ✅ Add middleware to handle FormData
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for FormData
                ignoredActions: [
                    'doubtSolution/submitDoubt/pending', 
                    'doubtSolution/submitDoubt/fulfilled',
                    'doubtSolution/submitDoubt/rejected'
                ],
            },
        }),
});

export default store;
