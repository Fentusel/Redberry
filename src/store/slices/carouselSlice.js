import {fetchFeatured}  from "../../api/moviesApi.js"
import {createSlice} from "@reduxjs/toolkit";


const carouselSlice = createSlice({
    name: 'carousel',

    initialState: {
        items: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchFeatured.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchFeatured.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchFeatured.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default carouselSlice.reducer;