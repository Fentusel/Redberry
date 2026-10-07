import { configureStore } from "@reduxjs/toolkit";
import carouselReducer from "./slices/carouselSlice.js";

export const store = configureStore({
    reducer: {
        carousel: carouselReducer
    }
})