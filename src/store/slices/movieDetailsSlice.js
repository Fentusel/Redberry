import { createSlice } from "@reduxjs/toolkit";
import { fetchMovieDetails, fetchMovieSessions } from "../../api/moviesApi.js";

const initialState = {
    movie: null,
    movieStatus: "idle",
    movieError: null,
    selectedDate: null,
    groups: [],
    sessionsStatus: "idle",
    sessionsError: null,
};

const movieDetailsSlice = createSlice({
    name: "movieDetails",
    initialState,
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        clearMovieDetails: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.movieStatus = "succeeded";
                state.movie = action.payload;
                state.selectedDate = action.payload.availableDates[0] || null;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.movieStatus = "failed";
                state.movieError = action.payload || "Not found.";
            })
            .addCase(fetchMovieSessions.pending, (state) => {
                state.sessionsStatus = "loading";
                state.sessionsError = null;
                state.groups = [];
            })
            .addCase(fetchMovieSessions.fulfilled, (state, action) => {
                state.sessionsStatus = "succeeded";
                state.groups = action.payload;
            })
            .addCase(fetchMovieSessions.rejected, (state, action) => {
                if (action.meta.aborted) return;
                state.sessionsStatus = "failed";
                state.sessionsError = action.payload || "Not found.";
            });
    },
});

export const { setSelectedDate, clearMovieDetails } = movieDetailsSlice.actions;
export default movieDetailsSlice.reducer;