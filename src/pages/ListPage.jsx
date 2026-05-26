import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListView from "../components/ListView";
import { setCategoryFilter, setQuery, setStatusFilter } from "../store/uiSlice";
import { useGoalActions } from "../hooks/useGoalActions";

function ListPage() {
    const dispatch = useDispatch();
    const goals = useSelector((state) => state.goals.items);
    const query = useSelector((state) => state.ui.query);
    const categoryFilter = useSelector((state) => state.ui.categoryFilter);
    const statusFilter = useSelector((state) => state.ui.statusFilter);
    const {
        handleOpenEdit,
        handleDelete,
        handleToggleGoal
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
        <ListView
            goals={filteredGoals}
            query={query}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            onQueryChange={(value) => dispatch(setQuery(value))}
            onCategoryFilterChange={(value) => dispatch(setCategoryFilter(value))}
            onStatusFilterChange={(value) => dispatch(setStatusFilter(value))}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onToggleGoal={handleToggleGoal}
        />
    );
}

export default ListPage;
