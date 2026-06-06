import { useCallback, useEffect, useMemo, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Add, ArrowBack, CalendarToday, Delete, Edit, Check, Close
} from "@mui/icons-material";
import {
    Box, Button, Dialog, IconButton, InputAdornment,
    TextField, Tooltip, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CATEGORIES, ICON_OPTIONS, emptyDraft } from "../constants/goals";
import { createGoal, fetchGoals, updateGoal } from "../store/goalsSlice";
import { createId, getCategory, getIconKey, syncCompletion } from "../utils/goals";
import RoundedGoalIcon from "../components/RoundedGoalIcon";
import Stack from "../components/Stack";
import DragHandle from "../components/DragHandle";

function GoalFormPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const goals = useSelector((state) => state.goals.items);
    const loading = useSelector((state) => state.goals.loading);
    const isEditing = !!id;
    const background = location.state?.background;
    const isOverlay = !!background;

    const existingGoal = useMemo(
        () => isEditing && !loading ? goals.find((g) => String(g.id) === id) : null,
        [id, goals, isEditing, loading]
    );

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);

    const initialCategory = searchParams.get("category") || "short_term";

    const [draft, setDraft] = useState(() => {
        if (isEditing && existingGoal) {
            return { ...existingGoal };
        }
        const cat = getCategory(initialCategory);
        return { ...emptyDraft, category: cat.key, emoji: cat.iconKey };
    });
    const [newStepText, setNewStepText] = useState("");
    const [editingStepId, setEditingStepId] = useState(null);
    const [editingStepText, setEditingStepText] = useState("");

    useEffect(() => {
        if (isEditing && existingGoal) {
            setDraft({ ...existingGoal });
        }
    }, [isEditing, existingGoal]);

    const category = getCategory(draft.category);

    const updateDraft = useCallback((updates) => {
        setDraft((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleAddStep = useCallback(() => {
        const text = newStepText.trim();
        if (!text) return;
        setDraft((prev) => ({
            ...prev,
            steps: [...prev.steps, { stepId: createId(), text, done: false }]
        }));
        setNewStepText("");
    }, [newStepText]);

    const handleRemoveStep = useCallback((stepId) => {
        setDraft((prev) => ({
            ...prev,
            steps: prev.steps.filter((s) => s.stepId !== stepId)
        }));
        if (editingStepId === stepId) {
            setEditingStepId(null);
            setEditingStepText("");
        }
    }, [editingStepId]);

    const handleStartEditStep = useCallback((step) => {
        setEditingStepId(step.stepId);
        setEditingStepText(step.text);
    }, []);

    const handleSaveEditStep = useCallback(() => {
        const trimmed = editingStepText.trim();
        if (!trimmed || !editingStepId) return;
        setDraft((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
                s.stepId === editingStepId ? { ...s, text: trimmed } : s
            )
        }));
        setEditingStepId(null);
        setEditingStepText("");
    }, [editingStepText, editingStepId]);

    const handleCancelEditStep = useCallback(() => {
        setEditingStepId(null);
        setEditingStepText("");
    }, []);

    const stepSensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    }));

    const handleFormStepDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const steps = draft.steps;
        const oldIndex = steps.findIndex((s) => s.stepId === active.id);
        const newIndex = steps.findIndex((s) => s.stepId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newSteps = [...steps];
        newSteps.splice(newIndex, 0, newSteps.splice(oldIndex, 1)[0]);
        setDraft((prev) => ({ ...prev, steps: newSteps }));
    }, [draft.steps]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleSave = useCallback(async () => {
        const goalToSave = syncCompletion({
            ...draft,
            title: draft.title.trim(),
            description: draft.description.trim()
        });
        if (!goalToSave.title) return;

        try {
            if (isEditing) {
                await dispatch(updateGoal({ ...goalToSave, id })).unwrap();
                toast.success("Goal updated!");
            } else {
                await dispatch(createGoal(goalToSave)).unwrap();
                toast.success("Goal created!");
            }
            navigate(-1);
        } catch {
            toast.error("Failed to save goal");
        }
    }, [draft, dispatch, isEditing, id, navigate]);

    const content = (
        <>
            {/* Gradient Top Bar */}
            <Box sx={{
                height: 4,
                background: category.gradient,
                flexShrink: 0,
            }} />

            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.5,
                    borderBottom: "1px solid hsl(240, 10%, 90%)",
                    bgcolor: "#ffffff",
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        disableRipple
                        sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "8px",
                            bgcolor: "hsl(240, 20%, 96%)",
                            color: "hsl(240, 15%, 30%)",
                            "&:hover": {
                                bgcolor: "hsl(240, 20%, 90%)",
                            },
                        }}
                    >
                        <ArrowBack sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography
                        sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 700,
                            fontSize: 16,
                            color: "hsl(240, 15%, 10%)",
                        }}
                    >
                        {isEditing ? "Edit Goal" : "New Goal"}
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!draft.title.trim()}
                    size="small"
                    disableElevation
                    sx={{
                        background: category.gradient,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        px: 2.5,
                        py: 0.625,
                        borderRadius: "8px",
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                            boxShadow: "0 2px 8px rgb(0 0 0 / .12)",
                        },
                        "&.Mui-disabled": {
                            background: "hsl(240, 10%, 92%)",
                            color: "hsl(240, 6%, 70%)",
                        }
                    }}
                >
                    {isEditing ? "Save Changes" : "Create Goal"}
                </Button>
            </Box>

            {/* Form Body */}
            <Box sx={{ px: 3, py: 2.5, overflow: "auto", flex: 1, bgcolor: "#ffffff" }}>
                <Stack spacing={2.5}>
                    {/* Title */}
                    <Box>
                        <TextField
                            placeholder="What's your goal?"
                            value={draft.title}
                            onChange={(e) => updateDraft({ title: e.target.value })}
                            fullWidth
                            required
                            variant="standard"
                            autoFocus
                            InputProps={{ disableUnderline: true }}
                            sx={{
                                "& .MuiInputBase-input": {
                                    fontSize: 24,
                                    fontWeight: 700,
                                    fontFamily: "'Sora', sans-serif",
                                    py: 0.5,
                                    color: "hsl(240, 15%, 10%)",
                                    letterSpacing: "-0.02em",
                                    "&::placeholder": {
                                        color: "hsl(240, 10%, 78%)",
                                        opacity: 1,
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Category Selector */}
                    <Box>
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Category
                        </Typography>
                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: 0.75,
                        }}>
                            {CATEGORIES.map((item) => {
                                const selected = draft.category === item.key;
                                return (
                                    <Button
                                        key={item.key}
                                        onClick={() => updateDraft({ category: item.key, emoji: draft.emoji || item.iconKey })}
                                        disableRipple
                                        sx={{
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 0.5,
                                            p: 1,
                                            borderRadius: "10px",
                                            border: `1.5px solid ${selected ? item.progress : "hsl(240, 10%, 90%)"}`,
                                            bgcolor: selected ? item.soft : "#ffffff",
                                            color: selected ? item.text : "hsl(240, 15%, 10%)",
                                            textTransform: "none",
                                            minHeight: 64,
                                            transition: "all 150ms ease",
                                            "&:hover": {
                                                bgcolor: item.soft,
                                                borderColor: item.progress,
                                            },
                                        }}
                                    >
                                        <RoundedGoalIcon iconKey={item.iconKey} sx={{ color: item.text, fontSize: 18 }} />
                                        <Typography sx={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            textAlign: "center",
                                            lineHeight: 1.2,
                                            letterSpacing: "-0.01em",
                                        }}>
                                            {item.label}
                                        </Typography>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Description */}
                    <Box>
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Description
                        </Typography>
                        <TextField
                            placeholder="Add a short description (optional)"
                            value={draft.description}
                            onChange={(e) => updateDraft({ description: e.target.value })}
                            multiline
                            rows={2}
                            minRows={1}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    fontSize: 14,
                                    bgcolor: "hsl(240, 20%, 98%)",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "hsl(240, 10%, 88%)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "hsl(240, 10%, 78%)",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: category.progress,
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Icon Picker */}
                    <Box>
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Icon
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}>
                            {ICON_OPTIONS.map((option) => {
                                const selected = getIconKey(draft.emoji, category.iconKey) === option.key;
                                const Icon = option.Icon;
                                return (
                                    <Tooltip key={option.key} title={option.label} arrow placement="top">
                                        <IconButton
                                            onClick={() => updateDraft({ emoji: option.key })}
                                            size="small"
                                            disableRipple
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "8px",
                                                border: `1.5px solid ${selected ? category.progress : "hsl(240, 10%, 90%)"}`,
                                                bgcolor: selected ? category.soft : "transparent",
                                                color: selected ? category.text : "hsl(240, 8%, 55%)",
                                                transition: "all 150ms ease",
                                                "&:hover": {
                                                    bgcolor: category.soft,
                                                    borderColor: category.progress,
                                                },
                                            }}
                                        >
                                            <Icon style={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>

                    {/* Target Date */}
                    <Box>
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Target Date
                        </Typography>
                        <TextField
                            type="date"
                            value={draft.targetDate}
                            onChange={(e) => updateDraft({ targetDate: e.target.value })}
                            fullWidth
                            size="small"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarToday sx={{ color: "hsl(240, 8%, 55%)", fontSize: 16 }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "10px",
                                    fontSize: 14,
                                    bgcolor: "hsl(240, 20%, 98%)",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "hsl(240, 10%, 88%)",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "hsl(240, 10%, 78%)",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: category.progress,
                                    },
                                },
                                "& input[type='date']::-webkit-calendar-picker-indicator": {
                                    cursor: "pointer",
                                    opacity: 0.6,
                                }
                            }}
                        />
                    </Box>

                    {/* Subtasks */}
                    <Box>
                        <Typography sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            letterSpacing: "0.06em",
                        }}>
                            Subtasks
                        </Typography>

                        {draft.steps.length > 0 && (
                            <DndContext
                                sensors={stepSensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleFormStepDragEnd}
                            >
                                <SortableContext
                                    items={draft.steps.map((s) => s.stepId)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                                        {draft.steps.map((step, idx) => {
                                            const isEditing = editingStepId === step.stepId;
                                            return (
                                                <SortableFormStep
                                                    key={step.stepId}
                                                    step={step}
                                                    stepId={step.stepId}
                                                    isEditing={isEditing}
                                                    editingStepText={editingStepText}
                                                    setEditingStepText={setEditingStepText}
                                                    handleSaveEditStep={handleSaveEditStep}
                                                    handleCancelEditStep={handleCancelEditStep}
                                                    handleStartEditStep={handleStartEditStep}
                                                    handleRemoveStep={handleRemoveStep}
                                                    category={category}
                                                    idx={idx}
                                                />
                                            );
                                        })}
                                    </Stack>
                                </SortableContext>
                            </DndContext>
                        )}

                        {/* Add Step Input */}
                        <Box sx={{
                            display: "flex",
                            gap: 0.75,
                            alignItems: "flex-start",
                            pt: 0.8,
                        }}>
                            <TextField
                                value={newStepText}
                                onChange={(e) => setNewStepText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") { e.preventDefault(); handleAddStep(); }
                                }}
                                placeholder="Add a subtask..."
                                size="small"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        fontSize: 13,
                                        bgcolor: "hsl(240, 20%, 98%)",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "hsl(240, 10%, 88%)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "hsl(240, 10%, 78%)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: category.progress,
                                        },
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleAddStep}
                                disableElevation
                                sx={{
                                    px: 0,
                                    borderRadius: "8px",
                                    background: category.gradient,
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "0 2px 6px rgb(0 0 0 / .1)",
                                    },
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ height: 2 }} />
                </Stack>
            </Box>
        </>
    );

    if (isOverlay) {
        return (
            <Dialog
                open
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : "16px",
                        minHeight: isMobile ? "100vh" : "auto",
                        maxHeight: isMobile ? "100vh" : "88vh",
                        bgcolor: "#ffffff",
                        m: isMobile ? 0 : 1.5,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: isMobile
                            ? "none"
                            : "0 20px 60px rgb(0 0 0 / .12), 0 8px 20px rgb(0 0 0 / .06)",
                    }
                }}
            >
                {content}
            </Dialog>
        );
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            background: "hsl(240, 20%, 97%)",
            display: "flex",
            flexDirection: "column",
        }}>
            <Box sx={{
                maxWidth: 640,
                mx: "auto",
                width: "100%",
                bgcolor: "#ffffff",
                minHeight: "100vh",
                boxShadow: "0 0 40px rgb(0 0 0 / .04)",
            }}>
                {content}
            </Box>
        </Box>
    );
}

function SortableFormStep({ step, stepId, isEditing, editingStepText, setEditingStepText, handleSaveEditStep, handleCancelEditStep, handleStartEditStep, handleRemoveStep, category, idx }) {
    const {
        attributes, listeners, setNodeRef, setActivatorNodeRef,
        transform, transition, isDragging
    } = useSortable({ id: stepId });

    return (
        <Box
            ref={setNodeRef}
            className={isDragging ? "" : "group"}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: isDragging ? transition : "none",
                opacity: isDragging ? 0.4 : 1,
                zIndex: isDragging ? 10 : "auto",
            }}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                py: isEditing ? 0.5 : 0.875,
                px: 1.25,
                borderRadius: "8px",
                bgcolor: isEditing ? "hsl(240, 20%, 97%)" : "hsl(240, 20%, 98%)",
                border: `1px solid ${isEditing ? category.progress : "hsl(240, 10%, 92%)"}`,
                transition: "all 150ms ease",
                "&:hover": {
                    borderColor: isEditing ? category.progress : "hsl(240, 10%, 82%)",
                },
            }}
        >
            <DragHandle
                activatorRef={setActivatorNodeRef}
                listeners={listeners}
                attributes={attributes}
            />

            <Box sx={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                background: category.gradient,
                color: "white",
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                fontWeight: 800,
                fontFamily: "'Sora', sans-serif",
                flexShrink: 0,
            }}>
                {idx + 1}
            </Box>

            {isEditing ? (
                <TextField
                    value={editingStepText}
                    onChange={(e) => setEditingStepText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleSaveEditStep(); }
                        if (e.key === "Escape") { handleCancelEditStep(); }
                    }}
                    autoFocus
                    size="small"
                    fullWidth
                    variant="outlined"
                    sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "6px",
                            fontSize: 13,
                            py: 0.25,
                            bgcolor: "#ffffff",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "hsl(240, 10%, 82%)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: category.progress,
                            },
                        },
                    }}
                />
            ) : (
                <Typography sx={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "hsl(240, 15%, 15%)",
                }}>
                    {step.text}
                </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                {isEditing ? (
                    <>
                        <Tooltip title="Save" arrow placement="top">
                            <IconButton
                                onClick={handleSaveEditStep}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "#16a34a",
                                    "&:hover": {
                                        bgcolor: "hsl(142, 71%, 95%)",
                                    },
                                }}
                            >
                                <Check sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel" arrow placement="top">
                            <IconButton
                                onClick={handleCancelEditStep}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "hsl(240, 8%, 55%)",
                                    "&:hover": {
                                        bgcolor: "hsl(240, 20%, 93%)",
                                    },
                                }}
                            >
                                <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title="Edit" arrow placement="top">
                            <IconButton
                                onClick={() => handleStartEditStep(step)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "hsl(240, 8%, 65%)",
                                    "&:hover": {
                                        color: "#7c3aed",
                                        bgcolor: "hsl(262, 83%, 96%)",
                                    },
                                }}
                            >
                                <Edit sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow placement="top">
                            <IconButton
                                onClick={() => handleRemoveStep(step.stepId)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "hsl(240, 8%, 65%)",
                                    "&:hover": {
                                        color: "#dc2626",
                                        bgcolor: "hsl(0, 84%, 96%)",
                                    },
                                }}
                            >
                                <Delete sx={{ fontSize: 15 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default GoalFormPage;
