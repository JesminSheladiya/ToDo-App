import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import ListView from "../components/ListView";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { fetchFilteredGoals } from "../store/goalsSlice";
import { useGoalActions } from "../hooks/useGoalActions";
import api from "../api/api";

function ListPage() {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const goals = useSelector((state) => state.goals.filteredItems);
    const loading = useSelector((state) => state.goals.filteredLoading);
    const pagination = useSelector((state) => state.goals.pagination);
    const categories = useSelector((state) => state.config.categories);

    const query = searchParams.get("search") || "";
    const categoryFilter = searchParams.get("category") || "all";
    const statusFilter = searchParams.get("status") || "all";
    const page = Math.max(0, parseInt(searchParams.get("page") || "1") - 1);
    const pageSize = parseInt(searchParams.get("size") || "20");

    const [inputValue, setInputValue] = useState(query);
    const debounceRef = useRef(null);
    const [liveCategoryCounts, setLiveCategoryCounts] = useState({});
    const [liveStatusCounts, setLiveStatusCounts] = useState({});
    const [countsLoading, setCountsLoading] = useState(true);

    useEffect(() => {
        if (!categories || categories.length === 0) return;

        setCountsLoading(true);

        const baseParams = {};
        if (query) baseParams.search = query;
        if (statusFilter && statusFilter !== "all") baseParams.status = statusFilter;

        const countFor = (extra) =>
            api.get("/tasks", { params: { size: 1, ...baseParams, ...extra } })
                .then((res) => res?.data?.totalElements ?? 0)
                .catch(() => 0);

        const catPromises = categories.map((cat) =>
            countFor({ category: cat.key }).then((count) => ({ key: cat.key, count }))
        );

        const statusKeys = ["active", "completed", "paused"];
        const statusPromises = statusKeys.map((st) => {
            const params = { size: 1 };
            if (query) params.search = query;
            if (categoryFilter && categoryFilter !== "all") params.category = categoryFilter;
            params.status = st;
            return api.get("/tasks", { params })
                .then((res) => ({ key: st, count: res?.data?.totalElements ?? 0 }))
                .catch(() => ({ key: st, count: 0 }));
        });

        Promise.all([...catPromises, ...statusPromises]).then((results) => {
            const catCounts = {};
            const statCounts = { active: 0, completed: 0, paused: 0 };
            results.forEach((r) => {
                if (r.key === "active" || r.key === "completed" || r.key === "paused") {
                    statCounts[r.key] = r.count;
                } else {
                    catCounts[r.key] = r.count;
                }
            });
            setLiveCategoryCounts(catCounts);
            setLiveStatusCounts(statCounts);
        }).finally(() => {
            setCountsLoading(false);
        });
    }, [query, categoryFilter, statusFilter, categories]);

    useEffect(() => {
        const filters = {};
        if (query) filters.search = query;
        if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;
        if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
        dispatch(fetchFilteredGoals({
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            page,
            pageSize
        }));
    }, [query, categoryFilter, statusFilter, page, pageSize, dispatch]);

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
                next.delete("page");
                return next;
            }, { replace: true });
        }, 350);
    }, [setSearchParams]);

    const updateFilter = useCallback((key, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value && value !== "all") next.set(key, value);
            else next.delete(key);
            next.delete("page");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handlePageChange = useCallback((newPage) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("page", String(newPage + 1));
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handlePageSizeChange = useCallback((newSize) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("size", String(newSize));
            next.set("page", "1");
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
                countsLoading={countsLoading}
                goals={goals}
                categories={categories}
                storeCategoryCounts={liveCategoryCounts}
                storeStatusCounts={liveStatusCounts}
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
                page={pagination.page}
                pageSize={pagination.pageSize}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
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
