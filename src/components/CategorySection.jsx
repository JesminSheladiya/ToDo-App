import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { FaAngleDown } from "react-icons/fa6";
import { HiOutlineEye, HiOutlinePlusSm } from "react-icons/hi";
import { Box, Button, Collapse, IconButton, LinearProgress, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import AnimatedCounter from "./AnimatedCounter";
import SortableGoalRow from "./SortableGoalRow";
import GoalRow from "./GoalRow";
import RoundedGoalIcon from "./RoundedGoalIcon";
import { fetchFilteredGoals } from "../store/goalsSlice";

const VISIBLE_LIMIT = 10;
const PAGE_SIZES = [20, 40, 70, 100];

function CategorySection({ category, goals, categoryCounts = {}, loading = false, expanded = false, onViewAll, onCreate, onViewDetails, onEdit, onDelete, onToggleGoal, onToggleStep, onPauseToggle, onReorderGoals, onReorderSteps, className }) {
    const dispatch = useDispatch();
    const filteredItems = useSelector((state) => state.goals.filteredItems);
    const pagination = useSelector((state) => state.goals.pagination);
    const filteredLoading = useSelector((state) => state.goals.filteredLoading);
    const [sectionOpen, setSectionOpen] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [gotoPage, setGotoPage] = useState("");

    useEffect(() => {
        if (!expanded) return;
        dispatch(fetchFilteredGoals({
            filters: { category: category.key },
            page,
            pageSize,
        }));
    }, [expanded, category.key, page, pageSize, dispatch]);

    const visibleGoals = goals.slice(0, VISIBLE_LIMIT);
    const actualTotal = categoryCounts[category.key] ?? goals.length;
    const hasMore = actualTotal > VISIBLE_LIMIT;
    const stats = useMemo(() => {
        const total = categoryCounts[category.key] ?? goals.length;
        const completed = goals.filter((g) => g.completed || g.status === "completed").length;
        const totalSteps = goals.reduce((s, g) => s + (g.steps?.length || 0), 0);
        const doneSteps = goals.reduce((s, g) => s + (g.steps?.filter((st) => st.done).length || 0), 0);
        const stepProgress = total > 0
            ? Math.round(
                goals.reduce((sum, g) => {
                    const steps = g.steps || [];
                    if (steps.length === 0) return sum + (g.completed ? 1 : 0);
                    const done = steps.filter((s) => s.done).length;
                    return sum + done / steps.length;
                }, 0) / total * 100
            )
            : 0;
        return { total, completed, totalSteps, doneSteps, stepProgress };
    }, [goals, categoryCounts, category.key]);

    const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
    const sensors = useSensors(pointerSensor);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || !onReorderGoals || active.id === over.id) return;
        const goalIds = goals.map((g) => String(g.id));
        const oldIndex = goalIds.indexOf(active.id);
        const newIndex = goalIds.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const newIds = [...goalIds];
        newIds.splice(newIndex, 0, newIds.splice(oldIndex, 1)[0]);
        onReorderGoals(category.key, newIds);
    }, [goals, onReorderGoals, category.key]);

    const handlePageChange = useCallback((_, value) => {
        setPage(value - 1);
        setGotoPage("");
    }, []);

    const handlePageSizeChange = useCallback((e) => {
        setPageSize(Number(e.target.value));
        setPage(0);
    }, []);

    const handleGotoPage = useCallback((e) => {
        const val = e.target.value;
        if (val === "") { setGotoPage(""); return; }
        const num = parseInt(val, 10);
        if (isNaN(num)) return;
        const clamped = Math.max(1, Math.min(num, pagination.totalPages));
        setGotoPage(String(clamped));
        if (e.key === "Enter" || e.type === "blur") {
            setPage(clamped - 1);
        }
    }, [pagination.totalPages]);

    if (expanded) {
        return (
            <Box className={`category-section category-section--expanded${className ? ` ${className}` : ""}`}
                sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid hsl(240, 10%, 90%)",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgb(0 0 0 / .08)",
                }}
            >
                <Box className="category-section__bar" sx={{ height: 3, background: category.gradient }} />

                <Box className="category-section__header" sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                }}>
                    <Box className="category-section__icon" sx={{
                        width: 40, height: 40, borderRadius: "12px", backgroundColor: category.soft,
                        display: "grid", placeItems: "center", flexShrink: 0,
                    }}>
                        <RoundedGoalIcon className="category-section__icon-element" iconKey={category.iconKey} sx={{ color: category.text, fontSize: 22 }} />
                    </Box>
                    <Box className="category-section__info" sx={{ flex: 1, minWidth: 0 }}>
                        <Typography className="category-section__label" sx={{
                            fontSize: 16, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                            color: "hsl(240, 15%, 10%)", letterSpacing: "-0.01em", lineHeight: 1.3,
                        }}>
                            {category.label}
                        </Typography>
                        <Typography className="category-section__sublabel" sx={{
                            fontSize: 13, color: "hsl(240, 8%, 50%)", fontWeight: 500, lineHeight: 1.3,
                        }}>
                            {category.sublabel} &middot; {pagination.totalElements} total
                        </Typography>
                    </Box>
                </Box>

                <Box className="category-section__goals-list" sx={{ borderTop: "1px solid hsl(240, 10%, 90%)" }}>
                    {filteredLoading ? (
                        <Box sx={{ py: 6, textAlign: "center", color: "hsl(240, 8%, 60%)", fontSize: 14, fontWeight: 500 }}>
                            Loading tasks...
                        </Box>
                    ) : filteredItems.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: "center", color: "hsl(240, 8%, 60%)", fontSize: 14, fontWeight: 500 }}>
                            No tasks found
                        </Box>
                    ) : (
                        filteredItems.map((goal, index) => (
                            <GoalRow
                                key={goal.id}
                                goal={goal}
                                category={category}
                                onViewDetails={onViewDetails}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleGoal={onToggleGoal}
                                onToggleStep={onToggleStep}
                                onPauseToggle={onPauseToggle}
                                isLast={index === filteredItems.length - 1}
                            />
                        ))
                    )}
                </Box>

                {pagination.totalElements > pageSize && (
                    <Box className="category-section__pagination" sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        gap: { xs: 1, sm: 2, md: 3 },
                        px: { xs: 2, sm: 2.5 }, py: 1.5,
                        borderTop: "1px solid hsl(240, 10%, 90%)",
                        bgcolor: "hsl(240, 20%, 99%)",
                    }}>
                        <Box className="category-section__pagination-start" sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "space-between", sm: "flex-start" },
                            gap: 1,
                        }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <Typography sx={{ fontSize: 13, color: "hsl(240, 8%, 35%)", whiteSpace: "nowrap" }}>
                                    Rows:
                                </Typography>
                                <Select
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    size="small"
                                    sx={{
                                        fontSize: 13, fontWeight: 600, borderRadius: "8px",
                                        minWidth: 56, height: 30,
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "hsl(240, 10%, 88%)" },
                                    }}
                                >
                                    {PAGE_SIZES.map((s) => (
                                        <MenuItem key={s} value={s} sx={{ fontSize: 13 }}>{s}</MenuItem>
                                    ))}
                                </Select>
                            </Box>

                            <Typography sx={{
                                fontSize: 12, fontWeight: 500, color: "hsl(240, 8%, 35%)",
                                display: { xs: "block", sm: "none" },
                            }}>
                                {pagination.totalElements > 0
                                    ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, pagination.totalElements)} of ${pagination.totalElements}`
                                    : "No results"
                                }
                            </Typography>
                        </Box>

                        <Box className="category-section__pagination-end" sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: { xs: "center", sm: "flex-end" },
                            gap: 3,
                            rowGap: 1,
                            flexWrap: "wrap",
                        }}>
                            <Typography sx={{
                                fontSize: 13, fontWeight: 500, color: "hsl(240, 8%, 35%)",
                                display: { xs: "none", sm: "block" },
                            }}>
                                {pagination.totalElements > 0
                                    ? `Showing ${page * pageSize + 1}–${Math.min((page + 1) * pageSize, pagination.totalElements)} of ${pagination.totalElements}`
                                    : "No results"
                                }
                            </Typography>

                            <Pagination
                                page={pagination.totalPages > 0 ? page + 1 : 0}
                                count={pagination.totalPages}
                                onChange={handlePageChange}
                                size="small"
                                shape="rounded"
                                siblingCount={0}
                                boundaryCount={1}
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        fontSize: 12, fontWeight: 600,
                                        color: "hsl(240, 8%, 35%)",
                                        minWidth: { xs: 22, sm: 25 },
                                        height: { xs: 22, sm: 25 },
                                        borderRadius: "6px",
                                        "&.Mui-selected": {
                                            bgcolor: "#7c3aed", color: "#fff",
                                            "&:hover": { bgcolor: "#6d28d9" },
                                        },
                                        "&.MuiPaginationItem-ellipsis": {
                                            color: "hsl(240, 8%, 60%)",
                                        },
                                    },
                                }}
                            />

                            {pagination.totalPages > 10 && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Typography sx={{ fontSize: 12, color: "hsl(240, 8%, 35%)", whiteSpace: "nowrap" }}>
                                        Page No:
                                    </Typography>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={gotoPage}
                                        onChange={handleGotoPage}
                                        onBlur={handleGotoPage}
                                        onKeyDown={handleGotoPage}
                                        slotProps={{
                                            htmlInput: { min: 1, max: pagination.totalPages, style: { padding: "2px 4px", fontSize: 12 } },
                                        }}
                                        sx={{
                                            minWidth: 36, minHeight: 22,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "6px",
                                                "& .MuiOutlinedInput-notchedOutline": { borderColor: "hsl(240, 10%, 88%)" },
                                                "& input": { textAlign: "center" },
                                            },
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        );
    }

    return (
        <Box className={`category-section${className ? ` ${className}` : ""}`}
            sx={{
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid hsl(240, 10%, 90%)",
                overflow: "hidden",
                boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
                transition: "box-shadow 150ms ease, border-color 150ms ease",
                "&:hover": {
                    boxShadow: "0 1px 3px rgb(0 0 0 / .08), 0 1px 2px rgb(0 0 0 / .04)",
                },
            }}
        >
            <Box className="category-section__bar" sx={{
                height: 3,
                background: category.gradient,
            }} />

            <Box className="category-section__header"
                onClick={() => setSectionOpen(!sectionOpen)}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "background-color 150ms ease",
                    "&:hover": {
                        bgcolor: "hsl(240, 20%, 98%)",
                    },
                }}
            >
                <Box className="category-section__icon"
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        backgroundColor: category.soft,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                    }}
                >
                    <RoundedGoalIcon className="category-section__icon-element" iconKey={category.iconKey} sx={{ color: category.text, fontSize: 22 }} />
                </Box>

                <Box className="category-section__info" sx={{ flex: 1, minWidth: 0 }}>
                    <Typography className="category-section__label" sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'Sora', sans-serif",
                        color: "hsl(240, 15%, 10%)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                    }}>
                        {category.label}
                    </Typography>
                    <Typography className="category-section__sublabel" sx={{
                        fontSize: 13,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                    }}>
                        {category.sublabel}
                    </Typography>
                </Box>

                <Box className="category-section__stats-mobile"
                    sx={{
                        display: { xs: "flex", sm: "none" },
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: "8px",
                        bgcolor: category.soft,
                        border: `1px solid ${category.border}`,
                    }}
                >
                    <Box className="category-section__dot" sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: category.gradient,
                        flexShrink: 0,
                    }} />
                    <Typography className="category-section__count" sx={{ fontSize: 13, fontWeight: 700, color: category.text }}>
                        <AnimatedCounter value={stats.completed} loading={loading} sx={{ fontSize: 13, fontWeight: 700, color: category.text }} />/<AnimatedCounter value={stats.total} loading={loading} sx={{ fontSize: 13, fontWeight: 700, color: category.text }} />
                    </Typography>
                </Box>

                <Box className="category-section__actions" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, width: { xs: "100%", sm: "auto" } }} >
                    {stats.total > 0 && (
                        <Box className="category-section__progress" sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 100 }}>
                            <Box className="category-section__progress-bar" sx={{ flex: 1 }}>
                                <LinearProgress className="category-section__progress-track"
                                    variant="determinate"
                                    value={stats.stepProgress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 99,
                                        bgcolor: "hsl(240, 10%, 94%)",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 99,
                                            bgcolor: category.progress,
                                            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                                        }
                                    }}
                                />
                            </Box>
                            <Typography className="category-section__percentage" sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "hsl(240, 8%, 50%)",
                                minWidth: 28,
                                textAlign: "right",
                            }}>
                                <AnimatedCounter value={stats.stepProgress} loading={loading} suffix="%" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 50%)" }} />
                            </Typography>
                        </Box>
                    )}

                    <Box className="category-section__stats"
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: category.soft,
                            border: `1px solid ${category.border}`,
                        }}
                    >
                        <Box className="category-section__dot" sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: category.gradient,
                            flexShrink: 0,
                        }} />
                        <Typography className="category-section__count" sx={{ fontSize: 13, fontWeight: 700, color: category.text }}>
                            <AnimatedCounter value={stats.completed} loading={loading} sx={{ fontSize: 13, fontWeight: 700, color: category.text }} />/<AnimatedCounter value={stats.total} loading={loading} sx={{ fontSize: 13, fontWeight: 700, color: category.text }} />
                        </Typography>
                    </Box>

                    {actualTotal > 0 && (
                        <IconButton className="category-section__expand"
                            size="small"
                            sx={{
                                color: "hsl(240, 8%, 50%)",
                                transition: "transform 200ms ease",
                                transform: sectionOpen ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        >
                            <FaAngleDown sx={{ fontSize: 20 }} />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Collapse className="category-section__goals" in={sectionOpen} timeout={200}>
                {actualTotal > 0 && (
                    <Box className="category-section__goals-list" sx={{
                        borderTop: "1px solid hsl(240, 10%, 90%)",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={visibleGoals.map((g) => String(g.id))}
                                strategy={verticalListSortingStrategy}
                            >
                                {visibleGoals.map((goal, index) => (
                                    <SortableGoalRow
                                        className="category-section__sortable-goal-row"
                                        key={goal.id}
                                        goal={goal}
                                        category={category}
                                        onViewDetails={onViewDetails}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleGoal={onToggleGoal}
                                        onToggleStep={onToggleStep}
                                        onPauseToggle={onPauseToggle}
                                        onReorderSteps={onReorderSteps}
                                        isLast={index === visibleGoals.length - 1 && !hasMore}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {hasMore && (
                            <Box className="category-section__more" sx={{
                                background: "linear-gradient(to top, #ffffff 50%, transparent 100%)",
                                mt: -9,
                                pt: 8.5,
                                pb: 1.5,
                                px: { xs: 2, sm: 2.5 },
                                textAlign: "center",
                                position: "relative",
                                zIndex: 1,
                            }}>
                                <Button
                                    className="category-section__view-more"
                                    variant="text"
                                    size="small"
                                    onClick={() => onViewAll?.(category.key)}
                                    startIcon={<HiOutlineEye />}
                                    sx={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                        fontFamily: "'Sora', sans-serif",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        px: 2,
                                        py: 0.8,
                                        textTransform: "none",
                                        bgcolor: category.text,
                                        "&:hover": {
                                            bgcolor: category.text,
                                            opacity: 0.85,
                                        },
                                    }}
                                >
                                    View All {category.label} Tasks
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Collapse>

            <Box className="category-section__footer" sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1,
                borderTop: "1px solid hsl(240, 10%, 90%)",
                bgcolor: "hsl(240, 20%, 99%)",
            }}>
                <Button className="category-section__add-goal"
                    variant="text"
                    size="small"
                    onClick={() => onCreate(category.key)}
                    startIcon={<HiOutlinePlusSm />}
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: category.text,
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: category.soft,
                        },
                    }}
                >
                    Add goal
                </Button>
            </Box>
        </Box>
    );
}

export default CategorySection;
