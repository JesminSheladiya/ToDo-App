import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CATEGORIES } from "../constants/goals";
import CategorySection from "../components/CategorySection";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";
import { updateGoal, reorderGoals, reorderSteps } from "../store/goalsSlice";

function CategoriesPage() {
    const dispatch = useDispatch();
    const goals = useSelector((state) => state.goals.items);
    const activeCategory = useSelector((state) => state.ui.activeCategory);
    const {
        handleOpenCreate,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep
    } = useGoalActions();

    const handleReorderGoals = useCallback((categoryKey, orderedIds) => {
        dispatch(reorderGoals({ categoryKey, orderedIds }));
        orderedIds.forEach((id, index) => {
            const goal = goals.find((g) => String(g.id) === id);
            if (goal) {
                dispatch(updateGoal({ ...goal, taskOrder: index }));
            }
        });
    }, [goals, dispatch]);

    const handleReorderSteps = useCallback((goal, newSteps) => {
        dispatch(reorderSteps({ goalId: goal.id, newSteps }));
        dispatch(updateGoal({ ...goal, steps: newSteps }));
    }, [dispatch]);

    const filteredCategories = activeCategory === "all"
        ? CATEGORIES
        : CATEGORIES.filter((cat) => cat.key === activeCategory);

    return (
        <Stack spacing={2.5}>
            {filteredCategories.map((category) => (
                <CategorySection
                    key={category.key}
                    category={category}
                    goals={goals
                        .filter((goal) => goal.category === category.key)
                        .sort((a, b) => (a.taskOrder ?? 0) - (b.taskOrder ?? 0))
                    }
                    onCreate={handleOpenCreate}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onToggleGoal={handleToggleGoal}
                    onToggleStep={handleToggleStep}
                    onReorderGoals={handleReorderGoals}
                    onReorderSteps={handleReorderSteps}
                />
            ))}
        </Stack>
    );
}

export default CategoriesPage;
