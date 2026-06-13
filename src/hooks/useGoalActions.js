import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteGoal, updateGoal } from "../store/goalsSlice";

const stepSnapshots = new Map();

export function useGoalActions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [deleteDialog, setDeleteDialog] = useState(null);
    const deleteGoalRef = useRef(null);

    const handleDelete = useCallback((goal) => {
        stepSnapshots.delete(goal.id);
        deleteGoalRef.current = goal;
        setDeleteDialog({ title: goal.title, loading: false, error: null });
    }, []);

    const confirmDelete = useCallback(async () => {
        const goal = deleteGoalRef.current;
        if (!goal) return;
        setDeleteDialog({ title: goal.title, loading: true, error: null });
        try {
            await dispatch(deleteGoal(goal.id)).unwrap();
            setDeleteDialog(null);
        } catch {
            setDeleteDialog({ title: goal.title, loading: false, error: "Failed to delete goal" });
        }
    }, [dispatch]);

    const closeDeleteDialog = useCallback(() => {
        if (deleteDialog?.loading) return;
        setDeleteDialog(null);
    }, [deleteDialog?.loading]);

    const handleOpenCreate = useCallback((category) => {
        const cat = (typeof category === "string") ? category : "";
        const params = cat ? `?category=${cat}` : "";
        navigate(`/goals/new${params}`, { state: { background: location } });
    }, [navigate, location]);

    const handleOpenDetail = useCallback((goal) => {
        navigate(`/goals/${goal.id}`);
    }, [navigate]);

    const handleOpenEdit = useCallback((goal) => {
        navigate(`/goals/${goal.id}/edit`, { state: { background: location } });
    }, [navigate, location]);

    const handleToggleGoal = useCallback((goal) => {
        if (goal.status === "paused") return;
        const completed = !(goal.completed || goal.status === "completed");
        const steps = goal.steps || [];

        let nextSteps;
        if (completed) {
            stepSnapshots.set(goal.id, steps.map((s) => ({ ...s })));
            nextSteps = steps.map((step) => ({ ...step, done: true }));
        } else {
            const snapshot = stepSnapshots.get(goal.id);
            nextSteps = snapshot && snapshot.length > 0
                ? steps.map((s) => {
                    const prev = snapshot.find((p) => p.stepId === s.stepId);
                    return prev ? { ...s, done: prev.done } : { ...s, done: false };
                  })
                : steps.map((step) => ({ ...step, done: false }));
            stepSnapshots.delete(goal.id);
        }

        const nextGoal = { ...goal, steps: nextSteps, completed, status: completed ? "completed" : goal.status === "paused" ? "paused" : "active" };

        toast.promise(
            dispatch(updateGoal(nextGoal)).unwrap(),
            {
                pending: "Updating...",
                success: completed ? "Goal completed!" : "Goal reopened",
                error: "Failed to update goal"
            }
        );
    }, [dispatch]);

    const handlePauseToggle = useCallback((goal) => {
        if (goal.completed || goal.status === "completed") return;
        const isPaused = goal.status === "paused";
        const nextGoal = {
            ...goal,
            status: isPaused ? "active" : "paused",
            completed: isPaused ? false : goal.completed,
        };

        toast.promise(
            dispatch(updateGoal(nextGoal)).unwrap(),
            {
                pending: isPaused ? "Resuming goal..." : "Pausing goal...",
                success: isPaused ? "Goal resumed!" : "Goal paused",
                error: "Failed to update goal"
            }
        );
    }, [dispatch]);

    const handleToggleStep = useCallback((goal, stepId) => {
        const nextGoal = {
            ...goal,
            steps: goal.steps.map((step) =>
                (step.stepId === stepId)
                    ? { ...step, done: !step.done }
                    : step
            )
        };

        dispatch(updateGoal(nextGoal));
    }, [dispatch]);

    return {
        handleOpenCreate,
        handleOpenDetail,
        handleOpenEdit,
        handleDelete,
        confirmDelete,
        closeDeleteDialog,
        deleteDialog,
        handleToggleGoal,
        handleToggleStep,
        handlePauseToggle
    };
}
