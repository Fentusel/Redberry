import { configureStore } from "@reduxjs/toolkit";
import carouselReducer from "./slices/carouselSlice.js";
import nowPlayingReducer from "./slices/nowPlayingSlice.js";
import comingSoonReducer from "./slices/comingSoonSlice.js";
import movieDetailsReducer from "./slices/movieDetailsSlice";
import authReducer from "./slices/authSlice.js";

export const store = configureStore({
    reducer: {
        carousel: carouselReducer,
        nowPlayingCards: nowPlayingReducer,
        comingSoon: comingSoonReducer,
        movieDetails: movieDetailsReducer,
        auth: authReducer
    }
})