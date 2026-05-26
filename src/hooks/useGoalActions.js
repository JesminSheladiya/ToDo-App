import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGoal, deleteGoal, updateGoal } from "../store/goalsSlice";
import { closeEditor, openEditor, openEditorWithCategory } from "../store/uiSlice";
import { syncCompletion } from "../utils/goals";

export function useGoalActions() {
    const dispatch = useDispatch();
    const draft = useSelector((state) => state.ui.draft);
    const editingGoal = useSelector((state) => state.ui.editingGoal);

    const handleOpenCreate = useCallback((category) => {
        if (category) {
            dispatch(openEditorWithCategory(category));
        } else {
            dispatch(openEditor(null));
        }
    }, [dispatch]);

    const handleOpenEdit = useCallback((goal) => {
        dispatch(openEditor(goal));
    }, [dispatch]);

    const handleDelete = useCallback((goal) => {
        if (!window.confirm(`Delete "${goal.title}"?`)) return;
        dispatch(deleteGoal(goal.id));
    }, [dispatch]);

    const handleToggleGoal = useCallback((goal) => {
        const completed = !(goal.completed || goal.status === "completed");
        const nextGoal = {
            ...goal,
            completed,
            status: completed ? "completed" : "active",
            steps: (goal.steps || []).map((step) => ({ ...step, done: completed }))
        };

        dispatch(updateGoal(nextGoal));
    }, [dispatch]);

    const handleToggleStep = useCallback((goal, stepId) => {
        const nextGoal = {
            ...goal,
            steps: goal.steps.map((step) =>
                step.stepId === stepId
                    ? { ...step, done: !step.done }
                    : step
            )
        };

        dispatch(updateGoal(nextGoal));
    }, [dispatch]);

    const handleSave = useCallback(() => {
        const goalToSave = syncCompletion({
            ...draft,
            title: draft.title.trim(),
            description: draft.description.trim()
        });

        if (!goalToSave.title) return;

        if (editingGoal) {
            dispatch(updateGoal({ ...goalToSave, id: editingGoal.id }));
        } else {
            dispatch(createGoal(goalToSave));
        }
        dispatch(closeEditor());
    }, [dispatch, draft, editingGoal]);

    return {
        handleOpenCreate,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep,
        handleSave
    };
}
