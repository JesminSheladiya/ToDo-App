import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
    const response = await api.get("/tasks");
    return Array.isArray(response?.data) ? response.data : [];
});

export const fetchFilteredGoals = createAsyncThunk("goals/fetchFilteredGoals", async (filters) => {
    const params = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
    const response = await api.get("/tasks", { params });
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
        loading: true,
        filteredItems: [],
        filteredLoading: false,
        saving: false,
        updating: [],
        deleting: []
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
        },
        clearProcessing(state) {
            state.saving = false;
            state.updating = [];
            state.deleting = [];
        },
        clearFiltered(state) {
            state.filteredItems = [];
            state.filteredLoading = false;
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
            .addCase(fetchFilteredGoals.pending, (state) => {
                state.filteredLoading = true;
            })
            .addCase(fetchFilteredGoals.fulfilled, (state, action) => {
                state.filteredItems = action.payload;
                state.filteredLoading = false;
            })
            .addCase(fetchFilteredGoals.rejected, (state) => {
                state.filteredLoading = false;
            })
            .addCase(createGoal.pending, (state) => {
                state.saving = true;
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.saving = false;
            })
            .addCase(createGoal.rejected, (state) => {
                state.saving = false;
            })
            .addCase(updateGoal.pending, (state, action) => {
                state.saving = true;
                const id = action.meta.arg.id;
                if (!state.updating.includes(id)) {
                    state.updating.push(id);
                }
            })
            .addCase(updateGoal.fulfilled, (state, action) => {
                const index = state.items.findIndex((g) => g.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.saving = false;
                state.updating = state.updating.filter((id) => id !== action.payload.id);
            })
            .addCase(updateGoal.rejected, (state, action) => {
                state.saving = false;
                state.updating = state.updating.filter((id) => id !== action.meta.arg.id);
            })
            .addCase(deleteGoal.pending, (state, action) => {
                const id = action.meta.arg;
                if (!state.deleting.includes(id)) {
                    state.deleting.push(id);
                }
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.items = state.items.filter((g) => g.id !== action.payload);
                state.deleting = state.deleting.filter((id) => id !== action.payload);
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.deleting = state.deleting.filter((id) => id !== action.meta.arg);
            });
    }
});

export const { reorderGoals, reorderSteps, clearProcessing, clearFiltered } = goalsSlice.actions;
export default goalsSlice.reducer;
