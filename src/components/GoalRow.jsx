import { useCallback, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle, Delete, Edit, ExpandMore, PauseCircle, PauseCircleOutlineRounded, PlayCircleOutlineRounded, RadioButtonUnchecked } from "@mui/icons-material";
import {
    Box, Button, Checkbox, Collapse, IconButton, LinearProgress, Tooltip, Typography
} from "@mui/material";
import { getStepProgress } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import DragHandle from "./DragHandle";

function SortableStep({ step, category, onToggleStep, goal, index }) {
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
        <div ref={setNodeRef} style={style} className={isDragging ? "" : "group"}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
            }}>
                <DragHandle
                    activatorRef={setActivatorNodeRef}
                    listeners={listeners}
                    attributes={attributes}
                    size={22}
                />
                <Button
                    variant="text"
                    onClick={() => onToggleStep(goal, step.stepId)}
                    size="small"
                    disableRipple
                    startIcon={step.done ? (
                        <CheckCircle sx={{ color: category.text, fontSize: 15 }} />
                    ) : (
                        <RadioButtonUnchecked sx={{ fontSize: 15, color: "hsl(240, 10%, 78%)" }} />
                    )}
                    sx={{
                        justifyContent: "flex-start",
                        color: step.done ? "hsl(240, 8%, 55%)" : "hsl(240, 15%, 25%)",
                        textDecoration: step.done ? "line-through" : "none",
                        textTransform: "none",
                        px: 0.5,
                        py: 0.25,
                        minHeight: 28,
                        fontSize: 13,
                        fontWeight: 500,
                        borderRadius: "6px",
                        flex: 1,
                        "&:hover": {
                            bgcolor: "hsl(240, 20%, 96%)",
                        },
                    }}
                >
                    {step.text}
                </Button>
            </div>
        </div>
    );
}

function GoalRow({ goal, category, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, onPauseToggle, isLast }) {
    const {
        attributes, listeners, setNodeRef, setActivatorNodeRef,
        transform, transition, isDragging
    } = useSortable({ id: String(goal.id) });

    const [expanded, setExpanded] = useState(false);
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
        <div ref={setNodeRef} style={wrapperStyle} className={isDragging ? "" : "group"}>
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.25,
                        py: 1.25,
                        minHeight: 52,
                        transition: "background-color 150ms ease",
                        "&:hover": {
                            bgcolor: "hsl(240, 20%, 98%)",
                        },
                        borderBottom: isLast ? "none" : "1px solid hsl(240, 10%, 93%)",
                    }}
                >
                    <DragHandle
                        activatorRef={setActivatorNodeRef}
                        listeners={listeners}
                        attributes={attributes}
                    />

                    <Checkbox
                        checked={completed}
                        onChange={() => onToggleGoal(goal)}
                        disableRipple
                        sx={{
                            p: 0,
                            width: 22,
                            height: 22,
                            color: "hsl(240, 10%, 80%)",
                            "&.Mui-checked": {
                                color: category.text,
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
                        icon={<RadioButtonUnchecked sx={{ fontSize: 22 }} />}
                        checkedIcon={<CheckCircle sx={{ fontSize: 22 }} />}
                    />

                    <RoundedGoalIcon
                        iconKey={goal.emoji}
                        fallbackKey={category.iconKey}
                        sx={{ color: category.text, fontSize: 16, flexShrink: 0 }}
                    />

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: completed ? "hsl(240, 8%, 55%)" : paused ? "hsl(39, 90%, 40%)" : "hsl(240, 15%, 10%)",
                                textDecoration: completed ? "line-through" : "none",
                                opacity: completed ? 0.8 : paused ? 0.75 : 1,
                                lineHeight: 1.4,
                                fontStyle: paused ? "italic" : "normal",
                            }}
                        >
                            {goal.title}
                        </Typography>
                        {paused && (
                            <Typography sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "hsl(39, 90%, 45%)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.25,
                                mt: 0.25,
                            }}>
                                <PauseCircleOutlineRounded sx={{ fontSize: 14 }} /> Paused
                            </Typography>
                        )}
                        {hasSteps && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                                <Typography sx={{
                                    fontSize: 12,
                                    color: "hsl(240, 8%, 50%)",
                                    fontWeight: 500,
                                }}>
                                    {goal.steps.filter((s) => s.done).length}/{goal.steps.length} steps
                                </Typography>
                                <Box sx={{ flex: 1, maxWidth: 60 }}>
                                    <LinearProgress
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

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>

                        {hasSteps && (
                            <IconButton
                                onClick={() => setExpanded(!expanded)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.5,
                                    color: "hsl(240, 8%, 55%)",
                                    transition: "transform 200ms ease",
                                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                                    "&:hover": {
                                        bgcolor: "hsl(240, 20%, 95%)",
                                    },
                                }}
                            >
                                <ExpandMore sx={{ fontSize: 20 }} />
                            </IconButton>
                        )}

                        <Tooltip title={paused ? "Resume" : "Pause"} arrow placement="top">
                            <IconButton
                                onClick={() => onPauseToggle(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.5,
                                    color: paused ? "hsl(39, 90%, 45%)" : "hsl(240, 8%, 65%)",
                                    "&:hover": {
                                        color: paused ? "#d97706" : "#7c3aed",
                                        bgcolor: paused ? "hsl(39, 90%, 95%)" : "hsl(262, 83%, 96%)",
                                    },
                                }}
                            >
                                {paused ? <PlayCircleOutlineRounded sx={{ fontSize: 22 }} /> : <PauseCircleOutlineRounded sx={{ fontSize: 22 }} />}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit" arrow placement="top">
                            <IconButton
                                onClick={() => onEdit(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.5,
                                    color: "hsl(240, 8%, 65%)",
                                    "&:hover": {
                                        color: "#7c3aed",
                                        bgcolor: "hsl(262, 83%, 96%)",
                                    },
                                }}
                            >
                                <Edit sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow placement="top">
                            <IconButton
                                onClick={() => onDelete(goal)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.5,
                                    color: "hsl(240, 8%, 65%)",
                                    "&:hover": {
                                        color: "#dc2626",
                                        bgcolor: "hsl(0, 84%, 96%)",
                                    },
                                }}
                            >
                                <Delete sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {hasSteps && (
                    <Collapse in={expanded} timeout={200}>
                        <Box sx={{
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
                                            key={step.stepId}
                                            step={step}
                                            category={category}
                                            onToggleStep={onToggleStep}
                                            goal={goal}
                                            index={idx}
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
