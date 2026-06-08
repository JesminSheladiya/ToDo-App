import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
    const response = await api.get("/tasks");
    return Array.isArray(response?.data) ? response.data : [];
});

export const createGoal = createAsyncThunk("goals/createGoal", async (goalData) => {
    const response = await api.post("/tasks", goalData);
    return response.data;
});

export const updateGoal = createAsyncThunk("goals/updateGoal", async (goal) => {
    const response = await api.put(`/tasks/${goal.id}`, goal);
    return response.data;
});

export const deleteGoal = createAsyncThunk("goals/deleteGoal", async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
});

export const batchReorder = createAsyncThunk("goals/batchReorder", async (payload) => {
    await api.put("/tasks/reorder", payload);
    return payload;
});

const goalsSlice = createSlice({
    name: "goals",
    initialState: {
        items: [],
        loading: true
    },
    reducers: {
        reorderGoals(state, action) {
            const { categoryKey, orderedIds } = action.payload;
            const categoryItems = state.items.filter((g) => g.category === categoryKey);
            const otherItems = state.items.filter((g) => g.category !== categoryKey);

            const reordered = orderedIds
                .map((id, index) => {
                    const goal = categoryItems.find((g) => String(g.id) === id);
                    if (!goal) return null;
                    return { ...goal, taskOrder: index };
                })
                .filter(Boolean);

            state.items = [...otherItems, ...reordered];
        },
        reorderSteps(state, action) {
            const { goalId, newSteps } = action.payload;
            const index = state.items.findIndex((g) => g.id === goalId);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], steps: newSteps };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGoals.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGoals.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchGoals.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                const index = state.items.findIndex((g) => g.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.items = state.items.filter((g) => g.id !== action.payload);
            });
    }
});

export const { reorderGoals, reorderSteps } = goalsSlice.actions;
export default goalsSlice.reducer;
