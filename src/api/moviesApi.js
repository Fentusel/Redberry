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
export const fetchNowPlaying = createAsyncThunk ("nowPlaying/fetchNowPlaying",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("https://api.kinoxii.redberryinternship.ge/api/movies/now-playing?limit=6");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || " Failed to fetch currently playing movies ");
        }
    })
export const fetchComingSoon = createAsyncThunk ("comingSoon/fetchComingSoon",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axios.get("https://api.kinoxii.redberryinternship.ge/api/movies/coming-soon?limit=4");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || " Failed to fetch coming soon movies ");
        }
    })
export const fetchMovieDetails = createAsyncThunk(
    "movieDetails/fetchMovieDetails",
    async (slug, { rejectWithValue, signal }) => {
        try {
            const response = await axios.get(`https://api.kinoxii.redberryinternship.ge/api/movies/${slug}`, { signal });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch movie");
        }
    }
);

export const fetchMovieSessions = createAsyncThunk(
    "movieDetails/fetchMovieSessions",
    async ({ slug, date }, { rejectWithValue, signal }) => {
        try {
            const response = await axios.get(`https://api.kinoxii.redberryinternship.ge/api/movies/${slug}/sessions`, {
                params: { date },
                signal,
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch sessions");
        }
    }
);