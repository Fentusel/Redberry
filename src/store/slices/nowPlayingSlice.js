import {fetchNowPlaying}  from "../../api/axios.js"
import {createSlice} from "@reduxjs/toolkit";

const nowPlayingSlice = createSlice ( {
    name: "nowPlaying",
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchNowPlaying.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNowPlaying.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchNowPlaying.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default nowPlayingSlice.reducer