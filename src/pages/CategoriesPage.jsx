import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategorySection from "../components/CategorySection";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";
import { updateGoal, reorderGoals, reorderSteps, batchReorder } from "../store/goalsSlice";

function CategoriesPage() {
    const dispatch = useDispatch();
    const goals = useSelector((state) => state.goals.items);
    const categories = useSelector((state) => state.config.categories);
    const activeCategory = useSelector((state) => state.ui.activeCategory);
    const {
        handleOpenCreate,
        handleOpenDetail,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep,
        handlePauseToggle,
        deleteDialog,
        confirmDelete,
        closeDeleteDialog,
    } = useGoalActions();

    const handleReorderGoals = useCallback((categoryKey, orderedIds) => {
        dispatch(reorderGoals({ categoryKey, orderedIds }));

        const goalOrders = orderedIds.map((id, index) => ({
            id: Number(id),
            position: index
        }));

        dispatch(batchReorder({ goals: goalOrders, steps: null }));
    }, [dispatch]);

    const handleReorderSteps = useCallback((goal, newSteps) => {
        dispatch(reorderSteps({ goalId: goal.id, newSteps }));
        dispatch(updateGoal({ ...goal, steps: newSteps }));
    }, [dispatch]);

    const filteredCategories = activeCategory === "all"
        ? categories
        : categories.filter((cat) => cat.key === activeCategory);

    return (
        <Stack className="categories-page" spacing={2.5}>
            {filteredCategories.map((category) => (
                <CategorySection
                    key={category.key}
                    category={category}
                    goals={goals
                        .filter((goal) => goal.category === category.key)
                        .sort((a, b) => (a.taskOrder ?? 0) - (b.taskOrder ?? 0))
                    }
                    onCreate={handleOpenCreate}
                    onViewDetails={handleOpenDetail}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onToggleGoal={handleToggleGoal}
                    onToggleStep={handleToggleStep}
                    onPauseToggle={handlePauseToggle}
                    onReorderGoals={handleReorderGoals}
                    onReorderSteps={handleReorderSteps}
                />
            ))}
            <ConfirmDeleteDialog
                open={!!deleteDialog}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                message={<>Are you sure you want to delete &ldquo;<strong className="categories-page__strong">{deleteDialog?.title || ""}</strong>&rdquo;?</>}
                loading={deleteDialog?.loading}
                error={deleteDialog?.error}
            />
        </Stack>
    );
}

export default CategoriesPage;
