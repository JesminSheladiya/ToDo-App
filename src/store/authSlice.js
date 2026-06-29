import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

const savedUser = JSON.parse(localStorage.getItem("user"));
const savedToken = localStorage.getItem("token");

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/register", data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed";
        return rejectWithValue(msg);
    }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/login", data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Invalid email or password";
        return rejectWithValue(msg);
    }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/forgot-password", data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to send OTP";
        return rejectWithValue(msg);
    }
});

export const verifyOtp = createAsyncThunk("auth/verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/verify-otp", data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Invalid or expired OTP";
        return rejectWithValue(msg);
    }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (data, { rejectWithValue }) => {
    try {
        const response = await api.post("/auth/reset-password", data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to change password";
        return rejectWithValue(msg);
    }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
    try {
        const response = await api.put("/auth/update-profile", data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to update profile";
        return rejectWithValue(msg);
    }
});

export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, { rejectWithValue }) => {
    try {
        const response = await api.delete("/auth/delete-account");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.message || "Failed to delete account";
        return rejectWithValue(msg);
    }
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/auth/me");
        return response.data;
    } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return rejectWithValue(err.response?.data?.message || "Session expired");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: savedUser || null,
        token: savedToken || null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.error = null;
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("goals");
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                state.token = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                localStorage.setItem("user", JSON.stringify(action.payload));
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
