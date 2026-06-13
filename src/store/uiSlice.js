import { createSlice } from "@reduxjs/toolkit";
import { emptyDraft } from "../constants/goals";

let tempIdCounter = 0;

function tempId() {
    return `temp_${++tempIdCounter}_${Date.now()}`;
}

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        editorOpen: false,
        editingGoal: null,
        draft: { ...emptyDraft },
        newStepText: "",
        query: "",
        categoryFilter: "all",
        statusFilter: "all",
        activeCategory: "all",
    },
    reducers: {
        openEditor(state, action) {
            const goal = action.payload;

            if (goal) {
                state.editingGoal = goal;
                state.draft = JSON.parse(JSON.stringify(goal));
            } else {
                state.editingGoal = null;
                state.draft = { ...emptyDraft };
            }
            state.newStepText = "";
            state.editorOpen = true;
        },
        openEditorWithCategory(state, action) {
            const categoryKey = action.payload;

            state.editingGoal = null;
            state.draft = {
                ...emptyDraft,
                category: categoryKey
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
                stepId: null,
                _tempId: tempId(),
                text,
                done: false
            });
            state.newStepText = "";
        },
        removeDraftStep(state, action) {
            const id = action.payload;
            state.draft.steps = state.draft.steps.filter(
                (step) => step.stepId !== id && step._tempId !== id
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
        },
        setActiveCategory(state, action) {
            state.activeCategory = action.payload;
        },
        clearActiveCategory(state) {
            state.activeCategory = "all";
        },
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
    setStatusFilter,
    setActiveCategory,
    clearActiveCategory,
} = uiSlice.actions;

export default uiSlice.reducer;
