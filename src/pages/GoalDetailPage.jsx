import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Box, Chip, CircularProgress, IconButton, LinearProgress, Typography
} from "@mui/material";
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import { PiArrowLeftBold, PiCalendarBlank, PiClock, PiNotePencil, PiListChecks, PiTrashBold, PiDotsSixVerticalBold } from "react-icons/pi";
import { IoSparkles } from "react-icons/io5";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";
import dayjs from "dayjs";
import { getStepProgress } from "../utils/goals";
import RoundedGoalIcon from "../components/RoundedGoalIcon";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";
import { updateGoal } from "../store/goalsSlice";
import { MdOutlineReportGmailerrorred } from "react-icons/md";

function SortableDetailStep({ step, category, onToggle, index, loading, disabled }) {
    const {
        attributes, listeners, setNodeRef, setActivatorNodeRef,
        transform, transition, isDragging
    } = useSortable({ id: step.stepId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : "none",
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
        zIndex: isDragging ? 10 : "auto",
    };

    return (
        <div ref={setNodeRef} style={style} className="goal-detail-page__step-wrapper">
            <Box className="detail-subtask-root"
                sx={{
                    display: "flex", alignItems: "center", gap: 0.75,
                    px: 1, py: 0.75, borderRadius: "8px",
                    bgcolor: step.done ? "hsl(142, 71%, 97%)" : "hsl(210, 76%, 99%)",
                    border: step.done ? "1px solid hsl(142, 71%, 90%)" : "1px solid hsl(210, 76%, 95%)",
                    transition: "all 200ms ease",
                    "&:hover": {
                        bgcolor: step.done ? "hsl(142, 71%, 95%)" : "hsl(240, 20%, 98%)",
                        "& .detail-subtask-text": { textDecoration: "none" },
                    },
                }}>
                <Box className="detail-subtask__drag" ref={setActivatorNodeRef} {...attributes} {...listeners}
                    sx={{
                        display: "flex", cursor: "grab", color: "hsl(240, 8%, 0%)",
                        "&:active": { cursor: "grabbing" },
                    }}
                >
                    <PiDotsSixVerticalBold size={16} />
                </Box>
                <Box className="detail-subtask__toggle" onClick={() => !disabled && onToggle(step.stepId)}
                    sx={{ display: "flex", cursor: disabled ? "default" : "pointer", lineHeight: 0, flexShrink: 0 }}>
                    {loading ? (
                        <CircularProgress size={14} sx={{ color: "hsl(240, 10%, 60%)" }} />
                    ) : step.done ? (
                        <FaCircleCheck size={16} color={category.text} />
                    ) : (
                        <FaRegCircle size={16} color="hsl(240, 10%, 60%)" />
                    )}
                </Box>
                <Typography className="detail-subtask-text" sx={{
                    flex: 1, fontSize: 14, fontWeight: 500,
                    color: step.done ? "hsl(240, 8%, 45%)" : "hsl(240, 15%, 10%)",
                    textDecoration: step.done ? "line-through" : "none",
                    transition: "all 200ms ease",
                    wordBreak: "break-word",
                }}>
                    {step.text}
                </Typography>
            </Box>
        </div>
    );
}

function GoalDetailPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const {
        handleDelete,
        deleteDialog,
        confirmDelete,
        closeDeleteDialog,
    } = useGoalActions();
    const goals = useSelector((state) => state.goals.items);
    const categories = useSelector((state) => state.config.categories);
    const updating = useSelector((state) => state.goals.updating);

    const goal = useMemo(
        () => goals.find((g) => String(g.id) === id),
        [id, goals]
    );

    const category = useMemo(
        () => categories.find((c) => c.key === goal?.category),
        [categories, goal?.category]
    );

    const goalId = goal?.id;
    const isUpdating = goalId ? updating.includes(goalId) : false;


    const [steps, setSteps] = useState(() => goal?.steps ? [...goal.steps] : []);
    const [togglingStepId, setTogglingStepId] = useState(null);

    useEffect(() => {
        if (goal?.steps) setSteps([...goal.steps]);
    }, [goal?.steps]);

    const progress = goal ? getStepProgress({ ...goal, steps }) : 0;
    const hasSteps = steps.length > 0;

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    });
    const sensors = useSensors(pointerSensor);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = steps.findIndex((s) => s.stepId === active.id);
        const newIndex = steps.findIndex((s) => s.stepId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newSteps = [...steps];
        newSteps.splice(newIndex, 0, newSteps.splice(oldIndex, 1)[0]);
        setSteps(newSteps);

        if (goal) {
            dispatch(updateGoal({ ...goal, steps: newSteps }));
        }
    }, [steps, goal, dispatch]);

    const handleToggleStep = useCallback((stepId) => {
        const newSteps = steps.map((s) =>
            s.stepId === stepId ? { ...s, done: !s.done } : s
        );
        setSteps(newSteps);
        setTogglingStepId(stepId);
        if (goal) {
            dispatch(updateGoal({ ...goal, steps: newSteps }))
                .finally(() => setTogglingStepId(null));
        }
    }, [steps, goal, dispatch]);

    if (!goal) {
        return (
            <Box className="goal-detail-page__not-found" sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, p: 3 }}>
                <Typography className="goal-detail-page__not-found-text" sx={{ fontSize: 20, fontWeight: 500, color: "#dc2626", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MdOutlineReportGmailerrorred size={22} color="#dc2626" />
                    Goal not found..!
                </Typography>
            </Box>
        );
    }

    return (
        <>
        <Box className="goal-detail-page__card" sx={{
            bgcolor: "#fff", borderRadius: "16px",
            border: "1px solid hsl(240, 10%, 90%)",
            overflow: "hidden", boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
        }}>
            <Box className="goal-detail-page__accent" sx={{ height: 4, background: category.gradient, flexShrink: 0 }} />

            <Box className="goal-detail-page__header" sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                px: 2.5, py: 1.5, borderBottom: "1px solid hsl(240, 10%, 90%)",
            }}>
                <Stack className="goal-detail-page__header-left" direction="row" spacing={1} alignItems="center">
                    <IconButton className="goal-detail-page__back-btn" onClick={() => navigate(-1)} size="small" disableRipple sx={{
                        width: 32, height: 32, borderRadius: "8px",
                        bgcolor: "hsl(240, 20%, 96%)", color: "hsl(240, 15%, 30%)",
                        "&:hover": { bgcolor: "hsl(240, 20%, 90%)" },
                    }}>
                        <PiArrowLeftBold size={18} />
                    </IconButton>
                    <Typography className="goal-detail-page__header-title" sx={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16,
                        color: "hsl(240, 15%, 10%)",
                    }}>
                        Goal Details
                    </Typography>
                </Stack>

                <Box className="goal-detail-page__header-actions" sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton className="goal-detail-page__edit-btn" onClick={() => navigate(`/goals/${id}/edit`, { state: { background: location } })} size="small" disableRipple sx={{
                        width: 32, height: 32, borderRadius: "8px",
                        bgcolor: "hsl(240, 20%, 96%)", color: "#7c3aed",
                        "&:hover": { bgcolor: "hsl(262, 83%, 96%)" },
                    }}>
                        <PiNotePencil size={18} />
                    </IconButton>
                    <IconButton className="goal-detail-page__delete-btn" onClick={() => handleDelete(goal)} size="small" disableRipple sx={{
                        width: 32, height: 32, borderRadius: "8px",
                        bgcolor: "hsl(240, 20%, 96%)",
                        color: "#dc2626",
                        "&:hover": { bgcolor: "hsl(0, 84%, 96%)" },
                    }}>
                        <PiTrashBold size={16} />
                    </IconButton>
                </Box>
            </Box>

            <Box className="goal-detail-page__content" sx={{ px: 2.5, py: 2.5, bgcolor: "#fff" }}>
                <Stack className="goal-detail-page__body" spacing={2.5}>
                    <Box className="goal-detail-page__top-section">
                        <Box className="goal-detail-page__title-row" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box className="goal-detail-page__icon-wrapper" sx={{
                                width: 48, height: 48, borderRadius: "14px",
                                bgcolor: category.soft, display: "grid", placeItems: "center",
                                flexShrink: 0,
                            }}>
                                <RoundedGoalIcon iconKey={goal.emoji} fallbackKey={category.iconKey}
                                    sx={{ color: category.text, fontSize: 24 }} />
                            </Box>
                            <Box className="goal-detail-page__title-text">
                                <Typography className="goal-detail-page__goal-title" sx={{
                                    fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif",
                                    color: "hsl(240, 15%, 5%)",
                                    wordBreak: "break-word",
                                    lineHeight: "1"
                                }}>
                                    {goal.title}
                                </Typography>
                                {goal.createdAt && (
                                    <Box className="goal-detail-page__created-date" sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 1 }}>
                                        <Box className="goal-detail-page__created-label" component="span" sx={{
                                            fontFamily: "'Sora', sans-serif",
                                            fontSize: 10, fontWeight: 600, color: "hsl(240, 8%, 55%)", letterSpacing: "0.04em",
                                        }}>
                                            Created
                                        </Box>
                                        <Typography className="goal-detail-page__created-value" component="span" sx={{
                                            fontSize: 12, fontStyle: "italic", fontWeight: 500,
                                            color: "hsl(240, 8%, 40%)",
                                        }}>
                                            {dayjs(goal.createdAt).format("DD MMM, YYYY")} | {dayjs(goal.createdAt).format("hh:mm A")}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box className="goal-detail-page__chips" sx={{ display: "flex", gap: 1, mt: 1.25, flexWrap: "wrap" }}>
                            <Chip className="goal-detail-page__chip" label={category.label} size="small" sx={{
                                bgcolor: category.soft, color: category.text,
                                fontWeight: 600, fontSize: 12, borderRadius: "6px",
                            }} />
                            {goal.status === "paused" ? (
                                <Chip className="goal-detail-page__chip" label="Paused" size="small" sx={{
                                    bgcolor: "hsl(39, 90%, 95%)", color: "hsl(39, 90%, 40%)",
                                    fontWeight: 600, fontSize: 12, borderRadius: "6px",
                                }} />
                            ) : goal.status === "completed" || goal.completed ? (
                                <Chip className="goal-detail-page__chip" label="Completed" size="small" sx={{
                                    bgcolor: "hsl(142, 71%, 95%)", color: "hsl(142, 71%, 35%)",
                                    fontWeight: 600, fontSize: 12, borderRadius: "6px",
                                }} />
                            ) : (
                                <Chip className="goal-detail-page__chip" label="Active" size="small" sx={{
                                    bgcolor: "hsl(142, 71%, 95%)", color: "hsl(142, 71%, 35%)",
                                    fontWeight: 600, fontSize: 12, borderRadius: "6px",
                                }} />
                            )}
                        </Box>
                    </Box>

                    <Box className="goal-detail-page__divider" sx={{ height: "1px", bgcolor: "hsl(240, 10%, 92%)" }} />

                    {goal.description && (
                        <Box className="goal-detail-page__description">
                            <Typography className="goal-detail-page__description-label" sx={{
                                fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)",
                                textTransform: "capitalize", mb: 1,
                            }}>
                                Description
                            </Typography>
                            <Box className="goal-detail-page__description-content" sx={{
                                bgcolor: "hsl(240, 20%, 98%)", borderRadius: "10px",
                                px: 1.5, py: 1.25,
                            }}>
                                <Typography className="goal-detail-page__description-text" sx={{
                                    fontSize: 14, fontWeight: 500, color: "hsl(240, 15%, 15%)",
                                    lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word",
                                }}>
                                    {goal.description}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {(goal.targetDate || goal.targetTime) && (
                        <Box className="goal-detail-page__target" sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                            <Box className="goal-detail-page__target-column">
                                <Typography className="goal-detail-page__target-label" sx={{
                                    fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)",
                                    textTransform: "capitalize", mb: 1,
                                }}>
                                    Target Date
                                </Typography>
                                <Box className="goal-detail-page__target-display" sx={{
                                    display: "inline-flex", alignItems: "center", gap: 1,
                                    bgcolor: "hsl(240, 20%, 98%)", borderRadius: "8px",
                                    px: 1.25, py: 0.75,
                                }}>
                                    <PiCalendarBlank size={18} color="hsl(240, 8%, 45%)" />
                                    <Typography className="goal-detail-page__target-date" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)" }}>
                                        {dayjs(goal.targetDate).format("DD MMM, YYYY")}
                                    </Typography>
                                    {goal.targetTime && (
                                        <>
                                            <Box className="goal-detail-page__target-divider" sx={{ width: "1px", height: 16, bgcolor: "hsl(240, 10%, 85%)" }} />
                                            <PiClock size={18} color="hsl(240, 8%, 45%)" />
                                            <Typography className="goal-detail-page__target-time" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)" }}>
                                                {dayjs(goal.targetTime, "HH:mm").format("hh:mm A")}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {hasSteps && (
                        <Box className="goal-detail-page__subtasks">
                            <Box className="goal-detail-page__subtasks-header" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                <Typography className="goal-detail-page__subtasks-label" sx={{
                                    fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)",
                                    textTransform: "capitalize",
                                }}>
                                    Subtasks
                                </Typography>
                                <Typography className="goal-detail-page__subtasks-count" sx={{
                                    fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 50%)",
                                    display: "flex", alignItems: "center", gap: 0.5,
                                }}>
                                    <PiListChecks size={15} />
                                    {steps.filter((s) => s.done).length}/{steps.length}
                                </Typography>
                            </Box>
                            <Box className="goal-detail-page__subtasks-progress" sx={{ mb: 1.5 }}>
                                <LinearProgress className="goal-detail-page__progress-bar" variant="determinate" value={progress} sx={{
                                    height: 4, borderRadius: 99, bgcolor: "hsl(240, 10%, 94%)",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 99, bgcolor: category.progress,
                                        transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                                    }
                                }} />
                            </Box>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={steps.map((s) => s.stepId)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Stack spacing={0.5}>
                                        {steps.map((step, idx) => (
                                            <SortableDetailStep
                                                key={step.stepId}
                                                step={step}
                                                category={category}
                                                onToggle={handleToggleStep}
                                                index={idx}
                                                loading={togglingStepId === step.stepId}
                                                disabled={!!togglingStepId}
                                            />
                                        ))}
                                    </Stack>
                                </SortableContext>
                            </DndContext>
                        </Box>
                    )}

                    {(!goal.description && !goal.targetDate && !goal.targetTime && !hasSteps) && (
                        <Box className="goal-detail-page__empty" sx={{
                            textAlign: "center", py: 4,
                            bgcolor: "hsl(240, 20%, 98%)", borderRadius: "12px",
                        }}>
                            <IoSparkles size={32} color="hsl(240, 8%, 70%)" style={{ marginBottom: 8 }} />
                            <Typography className="goal-detail-page__empty-text" sx={{ fontSize: 14, fontWeight: 500, color: "hsl(240, 8%, 50%)" }}>
                                No additional details added yet
                            </Typography>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Box>
            <ConfirmDeleteDialog className="goal-detail-page__delete-dialog"
                open={!!deleteDialog}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                message={<>Are you sure you want to delete &ldquo;<strong className="goal-detail-page__strong">{deleteDialog?.title || ""}</strong>&rdquo;?</>}
                loading={deleteDialog?.loading}
                error={deleteDialog?.error}
            />
        </>
    );
}

export default GoalDetailPage;
