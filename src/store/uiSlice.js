import { createSlice } from "@reduxjs/toolkit";
import { emptyDraft } from "../constants/goals";
import { createId, getCategory, normalizeGoal } from "../utils/goals";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        editorOpen: false,
        editingGoal: null,
        draft: { ...emptyDraft },
        newStepText: "",
        query: "",
        categoryFilter: "all",
        statusFilter: "all"
    },
    reducers: {
        openEditor(state, action) {
            const goal = action.payload;

            if (goal) {
                state.editingGoal = goal;
                state.draft = normalizeGoal(goal);
            } else {
                state.editingGoal = null;
                state.draft = { ...emptyDraft };
            }
            state.newStepText = "";
            state.editorOpen = true;
        },
        openEditorWithCategory(state, action) {
            const category = getCategory(action.payload);

            state.editingGoal = null;
            state.draft = {
                ...emptyDraft,
                category: category.key,
                emoji: category.iconKey
            };
            state.newStepText = "";
            state.editorOpen = true;
        },
        closeEditor(state) {
            state.editorOpen = false;
            state.editingGoal = null;
            state.draft = { ...emptyDraft };
            state.newStepText = "";
        },
        updateDraft(state, action) {
            state.draft = { ...state.draft, ...action.payload };
        },
        setNewStepText(state, action) {
            state.newStepText = action.payload;
        },
        addDraftStep(state) {
            const text = state.newStepText.trim();

            if (!text) return;

            state.draft.steps.push({
                stepId: createId(),
                text,
                done: false
            });
            state.newStepText = "";
        },
        removeDraftStep(state, action) {
            state.draft.steps = state.draft.steps.filter(
                (step) => step.stepId !== action.payload
            );
        },
        setQuery(state, action) {
            state.query = action.payload;
        },
        setCategoryFilter(state, action) {
            state.categoryFilter = action.payload;
        },
        setStatusFilter(state, action) {
            state.statusFilter = action.payload;
        }
    }
});

export const {
    openEditor,
    openEditorWithCategory,
    closeEditor,
    updateDraft,
    setNewStepText,
    addDraftStep,
    removeDraftStep,
    setQuery,
    setCategoryFilter,
    setStatusFilter
} = uiSlice.actions;

export default uiSlice.reducer;
