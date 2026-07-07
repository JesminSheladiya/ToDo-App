import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async (_, { getState }) => {
    const categories = getState().config.categories;

    const countByStatus = async (status) => {
        try {
            const res = await api.get("/tasks", { params: { status, size: 1 } });
            return res?.data?.totalElements ?? 0;
        } catch {
            return 0;
        }
    };

    if (!categories || categories.length === 0) {
        const response = await api.get("/tasks", { params: { size: 10 } });
        const data = response?.data;
        return {
            goals: data?.content || (Array.isArray(data) ? data : []),
            categoryCounts: {},
            totalElements: data?.totalElements ?? 0,
            statusCounts: { completed: 0, paused: 0 },
            totalSteps: 0,
            doneSteps: 0,
        };
    }

    const [categoryResults, completedCount, pausedCount, allTasksRes] = await Promise.all([
        Promise.all(
            categories.map((cat) =>
                api.get("/tasks", { params: { category: cat.key, size: 10 } })
                    .then((res) => {
                        const data = res?.data;
                        return {
                            category: cat.key,
                            goals: data?.content || (Array.isArray(data) ? data : []),
                            totalElements: data?.totalElements ?? 0,
                        };
                    })
                    .catch(() => ({ category: cat.key, goals: [], totalElements: 0 }))
            )
        ),
        countByStatus("completed"),
        countByStatus("paused"),
        api.get("/tasks", { params: { size: 10000 } }).then((res) => res?.data?.content || []).catch(() => []),
    ]);

    const categoryCounts = {};
    let totalElements = 0;
    const goals = [];
    categoryResults.forEach((r) => {
        categoryCounts[r.category] = r.totalElements;
        totalElements += r.totalElements;
        goals.push(...r.goals);
    });

    let totalSteps = 0;
    let doneSteps = 0;
    allTasksRes.forEach((g) => {
        const steps = g.steps || [];
        totalSteps += steps.length;
        doneSteps += steps.filter((s) => s.done).length;
    });

    return {
        goals,
        categoryCounts,
        totalElements,
        statusCounts: { completed: completedCount, paused: pausedCount },
        totalSteps,
        doneSteps,
    };
});

export const fetchFilteredGoals = createAsyncThunk("goals/fetchFilteredGoals", async ({ filters, page, pageSize }) => {
    const params = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.category) params.category = filters.category;
    if (filters?.status) params.status = filters.status;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;
    if (page !== undefined && page !== null) params.page = page;
    if (pageSize !== undefined && pageSize !== null) params.size = pageSize;
    const response = await api.get("/tasks", { params });
    return response?.data || { content: [], totalPages: 0, totalElements: 0, currentPage: 0, pageSize: 10 };
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
        categoryCounts: {},
        totalElements: 0,
        statusCounts: { completed: 0, paused: 0 },
        totalSteps: 0,
        doneSteps: 0,
        filteredItems: [],
        filteredLoading: false,
        pagination: {
            page: 0,
            pageSize: 10,
            totalPages: 0,
            totalElements: 0,
        },
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
                state.items = action.payload.goals;
                state.categoryCounts = action.payload.categoryCounts;
                state.totalElements = action.payload.totalElements;
                state.statusCounts = action.payload.statusCounts;
                state.totalSteps = action.payload.totalSteps;
                state.doneSteps = action.payload.doneSteps;
                state.loading = false;
            })
            .addCase(fetchGoals.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchFilteredGoals.pending, (state) => {
                state.filteredLoading = true;
            })
            .addCase(fetchFilteredGoals.fulfilled, (state, action) => {
                state.filteredItems = action.payload.content || [];
                state.pagination = {
                    page: action.payload.currentPage ?? 0,
                    pageSize: action.payload.pageSize ?? 20,
                    totalPages: action.payload.totalPages ?? 0,
                    totalElements: action.payload.totalElements ?? 0,
                };
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
                const fIndex = state.filteredItems.findIndex((g) => g.id === action.payload.id);
                if (fIndex !== -1) {
                    state.filteredItems[fIndex] = action.payload;
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
                state.filteredItems = state.filteredItems.filter((g) => g.id !== action.payload);
                state.deleting = state.deleting.filter((id) => id !== action.payload);
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.deleting = state.deleting.filter((id) => id !== action.meta.arg);
            });
    }
});

export const { reorderGoals, reorderSteps, clearProcessing, clearFiltered } = goalsSlice.actions;
export default goalsSlice.reducer;
