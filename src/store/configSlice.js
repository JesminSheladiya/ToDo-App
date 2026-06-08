import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchCategories = createAsyncThunk("config/fetchCategories", async () => {
    const response = await api.get("/categories");
    return response.data;
});

const configSlice = createSlice({
    name: "config",
    initialState: {
        categories: [],
        categoriesLoaded: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.categoriesLoaded = true;
            });
    }
});

export default configSlice.reducer;
