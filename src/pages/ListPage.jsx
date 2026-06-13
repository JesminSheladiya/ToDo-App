import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListView from "../components/ListView";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { setCategoryFilter, setQuery, setStatusFilter } from "../store/uiSlice";
import { useGoalActions } from "../hooks/useGoalActions";

function ListPage() {
    const dispatch = useDispatch();
    const goals = useSelector((state) => state.goals.items);
    const categories = useSelector((state) => state.config.categories);
    const query = useSelector((state) => state.ui.query);
    const categoryFilter = useSelector((state) => state.ui.categoryFilter);
    const statusFilter = useSelector((state) => state.ui.statusFilter);
    const {
        handleOpenDetail,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handlePauseToggle,
        deleteDialog,
        confirmDelete,
        closeDeleteDialog,
    } = useGoalActions();

    const filteredGoals = useMemo(() => {
        return goals.filter((goal) => {
            const matchesQuery = goal.title.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter;
            const matchesStatus = statusFilter === "all" || goal.status === statusFilter;

            return matchesQuery && matchesCategory && matchesStatus;
        });
    }, [goals, query, categoryFilter, statusFilter]);

    return (
        <>
            <ListView
                className="list-page"
                goals={filteredGoals}
                allGoals={goals}
                categories={categories}
                query={query}
                categoryFilter={categoryFilter}
                statusFilter={statusFilter}
                onQueryChange={(value) => dispatch(setQuery(value))}
                onCategoryFilterChange={(value) => dispatch(setCategoryFilter(value))}
                onStatusFilterChange={(value) => dispatch(setStatusFilter(value))}
                onViewDetails={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onToggleGoal={handleToggleGoal}
                onPauseToggle={handlePauseToggle}
            />
            <ConfirmDeleteDialog
                open={!!deleteDialog}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                message={<>Are you sure you want to delete &ldquo;<strong>{deleteDialog?.title || ""}</strong>&rdquo;?</>}
                loading={deleteDialog?.loading}
                error={deleteDialog?.error}
            />
        </>
    );
}

export default ListPage;
