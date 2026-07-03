import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ListView from "../components/ListView";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { fetchFilteredGoals } from "../store/goalsSlice";
import { useGoalActions } from "../hooks/useGoalActions";

function ListPage() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const goals = useSelector((state) => state.goals.filteredItems);
    const allGoals = useSelector((state) => state.goals.items);
    const loading = useSelector((state) => state.goals.filteredLoading);
    const categories = useSelector((state) => state.config.categories);

    const query = searchParams.get("search") || "";
    const categoryFilter = searchParams.get("category") || "all";
    const statusFilter = searchParams.get("status") || "all";

    const [inputValue, setInputValue] = useState(query);
    const debounceRef = useRef(null);

    useEffect(() => {
        const filters = {};
        if (query) filters.search = query;
        if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;
        if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
        dispatch(fetchFilteredGoals(Object.keys(filters).length > 0 ? filters : undefined));
    }, [query, categoryFilter, statusFilter, dispatch]);

    useEffect(() => {
        setInputValue(query);
    }, [query]);

    const handleQueryChange = useCallback((value) => {
        setInputValue(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set("search", value);
                else next.delete("search");
                return next;
            }, { replace: true });
        }, 350);
    }, [setSearchParams]);

    const updateFilter = useCallback((key, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value && value !== "all") next.set(key, value);
            else next.delete(key);
            return next;
        }, { replace: true });
    }, [setSearchParams]);

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

    return (
        <>
            <ListView
                className="list-page__list-view"
                loading={loading}
                goals={goals}
                allGoals={allGoals}
                categories={categories}
                query={inputValue}
                categoryFilter={categoryFilter}
                statusFilter={statusFilter}
                onQueryChange={handleQueryChange}
                onCategoryFilterChange={(value) => updateFilter("category", value)}
                onStatusFilterChange={(value) => updateFilter("status", value)}
                onViewDetails={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onToggleGoal={handleToggleGoal}
                onPauseToggle={handlePauseToggle}
            />
            <ConfirmDeleteDialog
                className="list-page__confirm-delete-dialog"
                open={!!deleteDialog}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                message={<>Are you sure you want to delete &ldquo;<strong className="list-page__strong">{deleteDialog?.title || ""}</strong>&rdquo;?</>}
                loading={deleteDialog?.loading}
                error={deleteDialog?.error}
            />
        </>
    );
}

export default ListPage;
