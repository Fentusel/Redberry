import { configureStore } from "@reduxjs/toolkit";
import carouselReducer from "./slices/carouselSlice.js";
import nowPlayingReducer from "./slices/nowPlayingSlice.js";
import comingSoonReducer from "./slices/comingSoonSlice.js";

export const store = configureStore({
    reducer: {
        carousel: carouselReducer,
        nowPlayingCards: nowPlayingReducer,
        comingSoon: comingSoonReducer,
    }
})