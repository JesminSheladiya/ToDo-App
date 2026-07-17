import { useCallback, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiDotsThreeVerticalBold, PiEyeBold } from "react-icons/pi";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";
import { TbPencil } from "react-icons/tb";
import { FiTrash } from "react-icons/fi";
import {
    Box, Checkbox, CircularProgress, ClickAwayListener, Collapse, IconButton, LinearProgress, Popper, Tooltip, Typography
} from "@mui/material";
import { getStepProgress } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import DragHandle from "./DragHandle";

function SortableStep({ step, category, onToggleStep, goal, index, togglingId, setTogglingId, className, onAllStepsComplete, paused }) {
    const isThisUpdating = togglingId === step.stepId;
    const isAnyUpdating = togglingId !== null || paused;
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
        <div ref={setNodeRef} style={style} className={`${isDragging ? "sortable-step sortable-step--dragging" : "sortable-step group"}${className ? ` ${className}` : ""}`}>
            <div className="sortable-step__content" style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "2px",
                width: "100%",
            }}>
                <Box className="sortable-step__drag" sx={{ mt: 0.25 }}>
                    <DragHandle
                        className="goal-row__drag-handle"
                        activatorRef={setActivatorNodeRef}
                        listeners={listeners}
                        attributes={attributes}
                        size={22}
                    />
                </Box>
                <Tooltip title="Goal is paused" disableHoverListener={!paused} arrow placement="top">
                    <Box component="span" sx={{ display: "inline-flex" }}>
                        <IconButton
                            className="sortable-step__toggle"
                            onClick={async () => {
                                if (isAnyUpdating) return;
                                const wasLastIncomplete = !step.done && goal.steps.every((s) => s.done || s.stepId === step.stepId);
                                setTogglingId(step.stepId);
                                try {
                                    await onToggleStep(goal, step.stepId);
                                    if (wasLastIncomplete) {
                                        onAllStepsComplete?.();
                                    }
                                } catch {
                                    // update failed
                                } finally {
                                    setTogglingId(null);
                                }
                            }}
                            size="small"
                            disableRipple
                            disabled={isAnyUpdating}
                            sx={{
                                p: 0.25,
                                mt: "5px",
                                fontSize: 14,
                                flexShrink: 0,
                                color: step.done ? category.text : "hsl(240, 10%, 60%)",
                                "&:hover": { bgcolor: "transparent" },
                            }}
                        >
                            {isThisUpdating ? (
                                <CircularProgress size={14} sx={{ color: category.text }} />
                            ) : step.done ? (
                                <FaCircleCheck />
                            ) : (
                                <FaRegCircle />
                            )}
                        </IconButton>
                    </Box>
                </Tooltip>
                <Typography className="sortable-step__text" sx={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: step.done ? "hsl(240, 8%, 50%)" : "hsl(240, 15%, 0%)",
                    textDecoration: step.done ? "line-through" : "none",
                    py: 0.5,
                    px: 0.5,
                    borderRadius: "6px",
                    cursor: "default",
                    transition: "0.4s all",
                    "&:hover": {
                        bgcolor: "hsl(240, 20%, 96%)",
                        textDecoration: "none",
                    },
                }}>
                    {step.text}
                </Typography>
            </div>
        </div>
    );
}

function GoalRow({ goal, category, onViewDetails, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, onPauseToggle, isLast }) {
    const [togglingId, setTogglingId] = useState(null);
    const {
        attributes, listeners, setNodeRef, setActivatorNodeRef,
        transform, transition, isDragging
    } = useSortable({ id: String(goal.id) });

    const [expanded, setExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileAnchorRef = useRef(null);
    const checkboxElRef = useRef(null);

    const setCheckboxRef = useCallback((node) => {
        checkboxElRef.current = node;
    }, []);

    const fireConfetti = useCallback((targetEl) => {
        const el = targetEl || checkboxElRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        const colors = ["#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"];
        confetti({ particleCount: 50, spread: 60, startVelocity: 25, origin: { x, y }, colors, disableForReducedMotion: true });
        confetti({ particleCount: 30, spread: 90, startVelocity: 15, origin: { x, y }, colors, disableForReducedMotion: true });
    }, []);

    const handleCheckboxComplete = useCallback(async () => {
        const wasCompleted = goal.completed || goal.status === "completed";
        setTogglingId("goal");
        try {
            await onToggleGoal(goal);
            if (!wasCompleted) fireConfetti();
        } catch {
            // update failed — confetti skipped
        } finally {
            setTogglingId(null);
        }
    }, [goal, onToggleGoal, fireConfetti]);

    const progress = getStepProgress(goal);
    const completed = goal.status === "completed" || goal.completed;
    const paused = goal.status === "paused";
    const hasSteps = goal.steps?.length > 0;

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    });
    const sensors = useSensors(pointerSensor);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || !onReorderSteps || active.id === over.id) return;

        const oldIndex = goal.steps.findIndex((s) => s.stepId === active.id);
        const newIndex = goal.steps.findIndex((s) => s.stepId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newSteps = [...goal.steps];
        newSteps.splice(newIndex, 0, newSteps.splice(oldIndex, 1)[0]);
        onReorderSteps(goal, newSteps);
    }, [goal, onReorderSteps]);

    const wrapperStyle = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? transition : "none",
        opacity: isDragging ? 0.4 : 1,
        position: "relative",
        zIndex: isDragging ? 10 : "auto",
    };

    return (
        <div ref={setNodeRef} style={wrapperStyle} className={isDragging ? "goal-row goal-row--dragging" : "goal-row group"}>
            <Box className="goal-row__card">
                <Box className="goal-row__header"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: { xs: 1, sm: 1.25 },
                        py: { xs: 1, sm: 1.25 },
                        minHeight: 52,
                        transition: "background-color 150ms ease",
                        "&:hover": {
                            bgcolor: "hsl(240, 20%, 98%)",
                        },
                        borderBottom: isLast ? "none" : "1px solid hsl(240, 10%, 93%)",
                    }}
                >
                    <DragHandle
                        className="goal-row__drag-handle"
                        activatorRef={setActivatorNodeRef}
                        listeners={listeners}
                        attributes={attributes}
                    />

                    <Tooltip title="Goal is paused" disableHoverListener={!paused} arrow placement="top">
                        <Box ref={setCheckboxRef} sx={{ display: { xs: "none", sm: "inline-flex" }, alignItems: "center", justifyContent: "center", width: 22, height: 22 }}>
                            {togglingId === "goal" ? (
                                <CircularProgress size={20} sx={{ color: category.text }} />
                            ) : (
                                <Checkbox
                                    className="goal-row__checkbox"
                                    checked={completed}
                                    onChange={handleCheckboxComplete}
                                    disableRipple
                                    disabled={paused || togglingId !== null}
                                    sx={{
                                        p: 0,
                                        width: 22,
                                        height: 22,
                                        color: paused ? "hsl(240, 10%, 78%)" : "hsl(240, 8%, 50%)",
                                        "&.Mui-checked": {
                                            color: category.text,
                                        },
                                        "&.Mui-disabled": {
                                            opacity: 0.35,
                                            cursor: "not-allowed",
                                            "&.Mui-checked": {
                                                color: "hsl(240, 10%, 78%)",
                                            },
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 22,
                                        },
                                        "&:hover": {
                                            bgcolor: "transparent",
                                        },
                                        "&.Mui-checked:hover": {
                                            bgcolor: "transparent",
                                        },
                                    }}
                                    icon={<FaRegCircle sx={{ fontSize: 22 }} />}
                                    checkedIcon={<FaCircleCheck sx={{ fontSize: 22 }} />}
                                />
                        )}
                        </Box>
                        </Tooltip>

                    <RoundedGoalIcon
                        className="goal-row__icon"
                        iconKey={goal.emoji}
                        fallbackKey={category.iconKey}
                        sx={{ color: category.text, fontSize: 16, flexShrink: 0 }}
                    />

                    <Box className="goal-row__info"
                        onClick={() => onViewDetails?.(goal)}
                        sx={{
                            flex: 1, minWidth: 0, cursor: "pointer",
                            px: 0.75, py: 0.25,
                            borderRadius: "6px",
                            transition: "background-color 150ms ease",
                            "&:hover": { bgcolor: "hsl(240, 20%, 96%)" },
                        }}
                    >
                        <Typography
                            className="goal-row__title"
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: completed ? "hsl(240, 8%, 50%)" : paused ? "hsl(39, 90%, 40%)" : "hsl(240, 15%, 10%)",
                                textDecoration: completed ? "line-through" : "none",
                                opacity: completed ? 0.8 : paused ? 0.75 : 1,
                                lineHeight: 1.4,
                                fontStyle: paused ? "italic" : "normal",
                            }}
                        >
                            {goal.title}
                        </Typography>
                        {paused && (
                            <Typography className="goal-row__paused-label" sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "hsl(39, 90%, 45%)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.25,
                                mt: 0.25,
                            }}>
                                <BsFillPauseFill size={14} /> Paused
                            </Typography>
                        )}
                        {hasSteps && (
                            <Box className="goal-row__progress-area" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                                <Typography className="goal-row__steps-count" sx={{
                                    fontSize: 12,
                                    color: "hsl(240, 8%, 50%)",
                                    fontWeight: 500,
                                }}>
                                    {goal.steps.filter((s) => s.done).length}/{goal.steps.length} steps
                                </Typography>
                                <Box className="goal-row__progress-track" sx={{ flex: 1, maxWidth: 60 }}>
                                    <LinearProgress
                                        className="goal-row__progress-bar"
                                        variant="determinate"
                                        value={progress}
                                        sx={{
                                            height: 4,
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
                            </Box>
                        )}
                    </Box>

                    <Box className="goal-row__actions" sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>

                        {hasSteps && (
                            <IconButton
                                className="goal-row__expand-btn"
                                onClick={() => setExpanded(!expanded)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.6,
                                    bgcolor: "hsl(240, 20%, 97%)",
                                    color: "hsl(240, 8%, 50%)",
                                    transition: "transform 200ms ease",
                                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                    "&:hover": {
                                        bgcolor: "hsl(240, 20%, 95%)",
                                    },
                                }}
                            >
                                <IoChevronDownOutline sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}

                        <Tooltip className="goal-row__pause-tooltip" title={completed ? "Cannot pause completed" : paused ? "Resume" : "Pause"} arrow placement="top">
                            <IconButton
                                className="goal-row__pause-btn"
                                onClick={() => onPauseToggle(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    p: 0.6,
                                    bgcolor: "hsl(240, 20%, 97%)",
                                    color: paused ? "hsl(39, 90%, 45%)" : "#d97706",
                                    opacity: completed ? 0.35 : 1,
                                    cursor: completed ? "not-allowed" : "pointer",
                                    "&:hover": {
                                        bgcolor: completed ? "hsl(240, 20%, 97%)" : "hsl(39, 90%, 95%)"
                                    },
                                }}
                            >
                                {paused ? <BsFillPlayFill size={18} /> : <BsFillPauseFill size={18} />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip className="goal-row__edit-tooltip" title="Edit" arrow placement="top">
                            <IconButton
                                className="goal-row__edit-btn"
                                onClick={() => onEdit(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    p: 0.6,
                                    bgcolor: "hsl(240, 20%, 97%)",
                                    color: "#7c3aed",
                                    "&:hover": {
                                        color: "#7c3aed",
                                        bgcolor: "hsl(262, 83%, 96%)",
                                    },
                                }}
                            >
                                <TbPencil size={18} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip className="goal-row__delete-tooltip" title="Delete" arrow placement="top">
                            <IconButton
                                className="goal-row__delete-btn"
                                onClick={() => onDelete(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    p: 0.6,
                                    bgcolor: "hsl(240, 20%, 97%)",
                                    color: "#dc2626",
                                    "&:hover": {
                                        color: "#dc2626",
                                        bgcolor: "hsl(0, 84%, 96%)",
                                    },
                                }}
                            >
                                <FiTrash size={18} />
                            </IconButton>
                        </Tooltip>

                        <Box className="goal-row__mobile-wrapper" ref={mobileAnchorRef} sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                            <IconButton
                                className="goal-row__mobile-trigger"
                                onClick={() => setMobileMenuOpen((v) => !v)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.6,
                                    bgcolor: "hsl(240, 20%, 97%)",
                                    color: "hsl(240, 8%, 50%)",
                                    "&:hover": {
                                        bgcolor: "hsl(240, 20%, 95%)",
                                    },
                                }}
                            >
                                <PiDotsThreeVerticalBold size={20} />
                            </IconButton>

                            <Popper
                                className="goal-row__mobile-popper"
                                open={mobileMenuOpen}
                                anchorEl={mobileAnchorRef.current}
                                placement="bottom-end"
                                sx={{ zIndex: 1400 }}
                            >
                                <ClickAwayListener className="goal-row__click-away" onClickAway={() => setMobileMenuOpen(false)}>
                                    <Box
                                        className="goal-row__mobile-dropdown"
                                        sx={{
                                            mt: 0.5,
                                            bgcolor: "#fff",
                                            borderRadius: "10px",
                                            border: "1px solid hsl(240, 10%, 90%)",
                                            boxShadow: "0 4px 16px rgb(0 0 0 / 10%)",
                                            minWidth: 150,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* View Details */}
                                        <Box
                                            className="goal-row__menu-item goal-row__menu-detail"
                                            onClick={() => {
                                                onViewDetails?.(goal);
                                                setMobileMenuOpen(false);
                                            }}
                                            sx={{
                                                px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
                                                color: "hsl(240, 8%, 20%)", cursor: "pointer",
                                                display: "flex", alignItems: "center", gap: 1.5,
                                                borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                transition: "0.3s all ease",
                                                "&:hover": { bgcolor: "hsl(240, 20%, 97%)", color: "#7c3aed" },
                                            }}
                                        >
                                            <PiEyeBold size={16} color="#7c3aed" />
                                            View Details
                                        </Box>

                                        {/* Complete */}
                                        <Tooltip title="Goal is paused" disableHoverListener={!paused} arrow placement="top">
                                            <Box
                                                className="goal-row__menu-item goal-row__menu-complete"
                                                onClick={async () => {
                                                    if (!paused && togglingId === null) {
                                                        setTogglingId("goal");
                                                        try {
                                                            await onToggleGoal(goal);
                                                            if (!completed) {
                                                                confetti({ particleCount: 50, spread: 60, startVelocity: 25, origin: { x: 0.5, y: 0.5 }, colors: ["#fb923c", "#facc15", "#4ade80", "#60a5fa", "#c084fc"], disableForReducedMotion: true });
                                                            }
                                                            setMobileMenuOpen(false);
                                                        } catch {
                                                            // update failed
                                                        } finally {
                                                            setTogglingId(null);
                                                        }
                                                    }
                                                }}
                                                sx={{
                                                    px: 1.5,
                                                    py: 1,
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    color: "hsl(240, 8%, 20%)",
                                                    cursor: (paused || togglingId !== null) ? "not-allowed" : "pointer",
                                                    opacity: (paused || togglingId !== null) ? 0.35 : 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                    borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                    transition: "0.3s all ease",
                                                    "&:hover": {
                                                        bgcolor: (paused || togglingId !== null) ? "inherit" : category.soft,
                                                        color: (paused || togglingId !== null) ? "inherit" : category.text,
                                                    },
                                                }}
                                            >
                                                {togglingId === "goal" ? (
                                                    <CircularProgress size={16} sx={{ color: category.text }} />
                                                ) : completed ? (
                                                    <FaCircleCheck
                                                        size={16}
                                                        color={category.text}
                                                    />
                                                ) : (
                                                    <FaRegCircle
                                                        size={16}
                                                        color={category.text}
                                                    />
                                                )}
                                                {completed ? "Incomplete" : "Complete"}
                                            </Box>
                                        </Tooltip>

                                        {/* Pause */}
                                        <Box
                                            className="goal-row__menu-item goal-row__menu-pause"
                                            onClick={() => {
                                                if (!completed) {
                                                    onPauseToggle(goal);
                                                    setMobileMenuOpen(false);
                                                }
                                            }}
                                            sx={{
                                                px: 1.5,
                                                py: 1,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: "hsl(240, 8%, 20%)",
                                                cursor: completed ? "not-allowed" : "pointer",
                                                opacity: completed ? 0.35 : 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                transition: "0.3s all ease",
                                                "&:hover": {
                                                    bgcolor: completed ? "inherit" : "hsla(38, 100%, 95%, 1)",
                                                    color: completed ? "inherit" : "hsl(39, 90%, 45%)",
                                                },
                                            }}
                                        >
                                            {paused ? (
                                                <BsFillPlayFill
                                                    size={18}
                                                    color="hsl(39, 90%, 45%)"
                                                />
                                            ) : (
                                                <BsFillPauseFill
                                                    size={18}
                                                    color="#d97706"
                                                />
                                            )}
                                            {paused ? "Resume" : "Pause"}
                                        </Box>

                                        {/* Edit */}
                                        <Box
                                            className="goal-row__menu-item goal-row__menu-edit"
                                            onClick={() => {
                                                onEdit(goal);
                                                setMobileMenuOpen(false);
                                            }}
                                            sx={{
                                                px: 1.5,
                                                py: 1,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: "hsl(240, 8%, 20%)",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                transition: "0.3s all ease",
                                                "&:hover": {
                                                    bgcolor: "hsl(240, 100%, 98%)",
                                                    color: "#7c3aed",
                                                },
                                            }}
                                        >
                                            <TbPencil
                                                size={18}
                                                color="#7c3aed"
                                            />
                                            Edit
                                        </Box>

                                        {/* Delete */}
                                        <Box
                                            className="goal-row__menu-item goal-row__menu-delete"
                                            onClick={() => {
                                                onDelete(goal);
                                                setMobileMenuOpen(false);
                                            }}
                                            sx={{
                                                px: 1.5,
                                                py: 1,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: "hsl(240, 8%, 20%)",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                transition: "0.3s all ease",
                                                "&:hover": {
                                                    bgcolor: "hsl(0, 100%, 98%)",
                                                    color: "#dc2626",
                                                },
                                            }}
                                        >
                                            <FiTrash
                                                size={16}
                                                color="#dc2626"
                                            />
                                            Delete
                                        </Box>
                                    </Box>
                                </ClickAwayListener>
                            </Popper>
                        </Box>
                    </Box>
                </Box>

                {hasSteps && (
                    <Collapse className="goal-row__steps-collapse" in={expanded} timeout={200}>
                        <Box className="goal-row__steps-list" sx={{
                            px: 1.25,
                            py: 0.75,
                            bgcolor: "hsl(240, 20%, 98.5%)",
                            borderBottom: isLast ? "none" : "1px solid hsl(240, 10%, 93%)",
                        }}>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={goal.steps.map((s) => s.stepId)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {goal.steps.map((step, idx) => (
                                        <SortableStep
                                            className="goal-row__sortable-step"
                                            key={step.stepId}
                                            step={step}
                                            category={category}
                                            onToggleStep={onToggleStep}
                                            goal={goal}
                                            index={idx}
                                            togglingId={togglingId}
                                            setTogglingId={setTogglingId}
                                            onAllStepsComplete={fireConfetti}
                                            paused={paused}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </Box>
                    </Collapse>
                )}


            </Box>
        </div>
    );
}

export default GoalRow;
