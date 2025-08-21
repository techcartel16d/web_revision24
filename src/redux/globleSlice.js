import { createSlice } from "@reduxjs/toolkit";


// Slice
const globleSlice = createSlice({
    name: 'globle',
    initialState: {
        isSideBar: false
    },

    reducers: {
        sidebarToggle: (state, action) => {
            state.isSideBar = !state.isSideBar
        }
    }

}
);

export const { sidebarToggle } = globleSlice.actions;

export default globleSlice.reducer;