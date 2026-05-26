import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteGoal, updateGoal } from "../store/goalsSlice";

export function useGoalActions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOpenCreate = useCallback((category) => {
        const params = category ? `?category=${category}` : "";
        navigate(`/goals/new${params}`);
    }, [navigate]);

    const handleOpenEdit = useCallback((goal) => {
        navigate(`/goals/${goal.id}/edit`);
    }, [navigate]);

    const handleDelete = useCallback((goal) => {
        if (!window.confirm(`Delete "${goal.title}"?`)) return;
        toast.promise(
            dispatch(deleteGoal(goal.id)).unwrap(),
            {
                loading: "Deleting goal...",
                success: `"${goal.title}" deleted!`,
                error: "Failed to delete goal"
            }
        );
    }, [dispatch]);

    const handleToggleGoal = useCallback((goal) => {
        const completed = !(goal.completed || goal.status === "completed");
        const nextGoal = {
            ...goal,
            completed,
            status: completed ? "completed" : "active",
            steps: (goal.steps || []).map((step) => ({ ...step, done: completed }))
        };

        toast.promise(
            dispatch(updateGoal(nextGoal)).unwrap(),
            {
                loading: "Updating...",
                success: completed ? "Goal completed!" : "Goal reopened",
                error: "Failed to update goal"
            }
        );
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

    return {
        handleOpenCreate,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep
    };
}
