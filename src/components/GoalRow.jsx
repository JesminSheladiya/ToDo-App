import { useCallback, useRef, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";
import { TbPencil } from "react-icons/tb";
import { FiTrash } from "react-icons/fi";
import {
    Box, Button, Checkbox, ClickAwayListener, Collapse, IconButton, LinearProgress, Popper, Tooltip, Typography
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
                alignItems: "flex-start",
                gap: "2px",
                width: "100%",
            }}>
                <Box sx={{ mt: 0.25 }}>
                    <DragHandle
                        activatorRef={setActivatorNodeRef}
                        listeners={listeners}
                        attributes={attributes}
                        size={22}
                    />
                </Box>
                <IconButton
                    onClick={() => onToggleStep(goal, step.stepId)}
                    size="small"
                    disableRipple
                    sx={{
                        p: 0.25,
                        mt: "5px",
                        fontSize: 14,
                        flexShrink: 0,
                        color: step.done ? category.text : "hsl(240, 10%, 60%)",
                        "&:hover": { bgcolor: "transparent" },
                    }}
                >
                    {step.done ? (
                        <FaCircleCheck />
                    ) : (
                        <FaRegCircle />
                    )}
                </IconButton>
                <Typography sx={{
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

function GoalRow({ goal, category, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, onPauseToggle, isLast }) {
    const {
        attributes, listeners, setNodeRef, setActivatorNodeRef,
        transform, transition, isDragging
    } = useSortable({ id: String(goal.id) });

    const [expanded, setExpanded] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileAnchorRef = useRef(null);

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
                        disabled={paused}
                        sx={{
                            display: { xs: "none", sm: "inline-flex" },
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
                            <Typography sx={{
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

                        <Tooltip title={completed ? "Cannot pause completed" : paused ? "Resume" : "Pause"} arrow placement="top">
                            <IconButton
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

                        <Tooltip title="Edit" arrow placement="top">
                            <IconButton
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
                        <Tooltip title="Delete" arrow placement="top">
                            <IconButton
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

                        <Box ref={mobileAnchorRef} sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                            <IconButton
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
                                open={mobileMenuOpen}
                                anchorEl={mobileAnchorRef.current}
                                placement="bottom-end"
                                sx={{ zIndex: 1400 }}
                            >
                                <ClickAwayListener onClickAway={() => setMobileMenuOpen(false)}>
                                    <Box
                                        sx={{
                                            mt: 0.5,
                                            bgcolor: "#fff",
                                            borderRadius: "10px",
                                            border: "1px solid hsl(240, 10%, 90%)",
                                            boxShadow: "0 4px 16px rgb(0 0 0 / 10%)",
                                            minWidth: 140,
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Complete */}
                                        <Box
                                            onClick={() => {
                                                if (!paused) {
                                                    onToggleGoal(goal);
                                                    setMobileMenuOpen(false);
                                                }
                                            }}
                                            sx={{
                                                px: 1.5,
                                                py: 1,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: "hsl(240, 8%, 20%)",
                                                cursor: paused ? "not-allowed" : "pointer",
                                                opacity: paused ? 0.35 : 1,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5,
                                                borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                transition: "0.3s all ease",
                                                "&:hover": {
                                                    bgcolor: paused ? "inherit" : category.soft,
                                                    color: paused ? "inherit" : category.text,
                                                },
                                            }}
                                        >
                                            {completed ? (
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

                                        {/* Pause */}
                                        <Box
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
