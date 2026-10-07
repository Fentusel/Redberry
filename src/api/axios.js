import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFeatured = createAsyncThunk ("carousel/fetchFeatured",
    async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("https://api.kinoxii.redberryinternship.ge/api/movies/featured");
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || " Failed to fetch features ");
    }
})

export default  fetchFeatured ;