import { configureStore } from '@reduxjs/toolkit';
import authUser from './authSlice'
import homePageSlice from './HomeSlice';
const store = configureStore({
    reducer: {
        authUser: authUser,
        home:homePageSlice
    },
});

export default store;