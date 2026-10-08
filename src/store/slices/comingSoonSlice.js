import {fetchComingSoon} from "../../api/axios";
import {createSlice} from "@reduxjs/toolkit";

const comingSoonSlice = createSlice({
    name: "comingSoon",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComingSoon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComingSoon.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchComingSoon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default comingSoonSlice.reducer;