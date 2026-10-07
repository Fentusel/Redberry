import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchFeaturedCarousel = createAsyncThunk(
    'carousel/fetchFeatured',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                'https://api.kinoxii.redberryinternship.ge/api/movies/featured'
            );

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch movies'
            );
        }
    }
);

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
            .addCase(fetchFeaturedCarousel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchFeaturedCarousel.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })

            .addCase(fetchFeaturedCarousel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default carouselSlice.reducer;