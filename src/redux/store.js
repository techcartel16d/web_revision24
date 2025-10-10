import { configureStore } from '@reduxjs/toolkit';
import authUser from './authSlice'
import homePageSlice from './HomeSlice';
import globleSlice from './globleSlice';
import liveQuizeReducer from "./LiveQuizeSlice";
import freeTest from "./freeTestSlice";
import Monthlymagzines from "./magzinesMonthle";
import FreeQuizeSlice from "./freeQuizeSlice";
import doubtSolutionReducer from './doubtSolutionSlice';
// ✅ ADD THIS IMPORT
import practiceBatchReducer from './practiceBatchDataSlice';

const store = configureStore({
    reducer: {
        authUser: authUser,
        home: homePageSlice,
        toggleSlice: globleSlice,
        liveQuize: liveQuizeReducer,
        monthlyMagazines: Monthlymagzines,
        getFreeQuizeData: FreeQuizeSlice,
        freeTest,
        doubtSolution: doubtSolutionReducer,
        practiceBatch: practiceBatchReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'doubtSolution/submitDoubt/pending', 
                    'doubtSolution/submitDoubt/fulfilled',
                    'doubtSolution/submitDoubt/rejected'
                ],
            },
        }),
});

export default store;
