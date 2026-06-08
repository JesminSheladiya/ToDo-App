import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteGoal, updateGoal } from "../store/goalsSlice";

const stepSnapshots = new Map();

export function useGoalActions() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenCreate = useCallback((category) => {
        const params = category ? `?category=${category}` : "";
        navigate(`/goals/new${params}`, { state: { background: location } });
    }, [navigate, location]);

    const handleOpenEdit = useCallback((goal) => {
        navigate(`/goals/${goal.id}/edit`, { state: { background: location } });
    }, [navigate, location]);

    const handleDelete = useCallback((goal) => {
        stepSnapshots.delete(goal.id);
        toast(
            ({ closeToast }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                    <span style={{ flex: 1, fontWeight: 600 }}>{`Delete "${goal.title}"?`}</span>
                    <button onClick={() => { closeToast();
                        toast.promise(
                            dispatch(deleteGoal(goal.id)).unwrap(),
                            {
                                pending: "Deleting goal...",
                                success: `"${goal.title}" deleted!`,
                                error: "Failed to delete goal"
                            }
                        );
                    }} style={{
                        background: "#ef4444", color: "#fff", border: "none",
                        borderRadius: 6, padding: "4px 12px", fontWeight: 700, fontSize: 12,
                        cursor: "pointer", flexShrink: 0,
                    }}>Delete</button>
                </div>
            ),
            { autoClose: 5000, closeButton: true, draggable: true, pauseOnHover: false, pauseOnFocusLoss: false }
        );
    }, [dispatch]);

    const handleToggleGoal = useCallback((goal) => {
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

        const nextGoal = { ...goal, steps: nextSteps, completed, status: completed ? "completed" : "active" };

        toast.promise(
            dispatch(updateGoal(nextGoal)).unwrap(),
            {
                pending: "Updating...",
                success: completed ? "Goal completed!" : "Goal reopened",
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
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep
    };
}
