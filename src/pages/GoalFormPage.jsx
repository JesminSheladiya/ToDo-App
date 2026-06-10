import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Box, Button, ClickAwayListener, Dialog, IconButton,
    Popper, TextField, Tooltip, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import { ICON_OPTIONS, emptyDraft } from "../constants/goals";
import { PiArrowLeftBold, PiCheckBold, PiXBold } from "react-icons/pi";
import { IoCalendarNumber } from "react-icons/io5";
import { TbPencil } from "react-icons/tb";
import { FiTrash } from "react-icons/fi";
import { createGoal, fetchGoals, updateGoal } from "../store/goalsSlice";
import { getIconKey } from "../utils/goals";
import RoundedGoalIcon from "../components/RoundedGoalIcon";
import Stack from "../components/Stack";
import DragHandle from "../components/DragHandle";

let tempStepId = 0;

function nextTempId() {
    return `step_${++tempStepId}`;
}

function GoalFormPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const goals = useSelector((state) => state.goals.items);
    const categories = useSelector((state) => state.config.categories);
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
            return JSON.parse(JSON.stringify(existingGoal));
        }
        return { ...emptyDraft, category: initialCategory };
    });
    const [newStepText, setNewStepText] = useState("");
    const [editingStep, setEditingStep] = useState(null);
    const [editingStepText, setEditingStepText] = useState("");
    const [calendarOpen, setCalendarOpen] = useState(false);
    const calendarAnchorRef = useRef(null);

    useEffect(() => {
        if (isEditing && existingGoal) {
            setDraft(JSON.parse(JSON.stringify(existingGoal)));
        }
    }, [isEditing, existingGoal]);

    const category = categories.find((c) => c.key === draft.category) || categories[0];

    const updateDraft = useCallback((updates) => {
        setDraft((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleAddStep = useCallback(() => {
        const text = newStepText.trim();
        if (!text) return;
        setDraft((prev) => ({
            ...prev,
            steps: [...prev.steps, { text, done: false, _tempId: nextTempId() }]
        }));
        setNewStepText("");
    }, [newStepText]);

    const handleRemoveStep = useCallback((id) => {
        const step = draft.steps.find((s) => s.stepId === id || s._tempId === id);
        toast(
            ({ closeToast }) => (
                <div className="goal-form-page__toast" style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 260 }}>
                    <span className="goal-form-page__toast-icon" style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                    <span className="goal-form-page__toast-message" style={{ flex: 1, fontWeight: 600 }}>Remove "{step?.text}"?</span>
                    <button className="goal-form-page__toast-delete-btn" onClick={() => {
                        closeToast();
                        setDraft((prev) => ({
                            ...prev,
                            steps: prev.steps.filter((s) => s.stepId !== id && s._tempId !== id)
                        }));
                        if (editingStep && (editingStep.stepId === id || editingStep._tempId === id)) {
                            setEditingStep(null);
                            setEditingStepText("");
                        }
                        toast.success("Subtask removed");
                    }} style={{
                        background: "#ef4444", color: "#fff", border: "none",
                        borderRadius: 6, padding: "6px 12px", fontWeight: 700, fontSize: 12,
                        cursor: "pointer", flexShrink: 0,
                    }}>Delete</button>
                </div>
            ),
            { autoClose: 5000, closeButton: true, draggable: true, pauseOnHover: false, pauseOnFocusLoss: false }
        );
    }, [draft, editingStep]);

    const handleStartEditStep = useCallback((step) => {
        setEditingStep(step);
        setEditingStepText(step.text);
    }, []);

    const handleSaveEditStep = useCallback(() => {
        const trimmed = editingStepText.trim();
        if (!trimmed || !editingStep) return;
        const id = editingStep.stepId || editingStep._tempId;
        setDraft((prev) => ({
            ...prev,
            steps: prev.steps.map((s) =>
                (s.stepId === id || s._tempId === id) ? { ...s, text: trimmed } : s
            )
        }));
        setEditingStep(null);
        setEditingStepText("");
    }, [editingStepText, editingStep]);

    const handleCancelEditStep = useCallback(() => {
        setEditingStep(null);
        setEditingStepText("");
    }, []);

    const stepSensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    }));

    const handleFormStepDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const steps = draft.steps;
        const oldIndex = steps.findIndex((s) => s.stepId === active.id || s._tempId === active.id);
        const newIndex = steps.findIndex((s) => s.stepId === over.id || s._tempId === over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newSteps = [...steps];
        newSteps.splice(newIndex, 0, newSteps.splice(oldIndex, 1)[0]);
        setDraft((prev) => ({ ...prev, steps: newSteps }));
    }, [draft.steps]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    function cleanStepsForSave(steps) {
        return steps.map((s) => {
            const clean = { text: s.text, done: s.done };
            if (s.stepId != null) clean.stepId = s.stepId;
            return clean;
        });
    }

    const handleSave = useCallback(async () => {
        const goalToSave = {
            ...draft,
            title: draft.title.trim(),
            description: draft.description.trim(),
            steps: cleanStepsForSave(draft.steps)
        };
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
            {category && (
                <Box className="goal-form-page__category-bar" sx={{
                    height: 4,
                    background: category.gradient,
                    flexShrink: 0,
                }} />
            )}

            <Box
                className="goal-form-page__header"
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
                <Stack className="goal-form-page__header-left" direction="row" spacing={1} alignItems="center">
                    <IconButton
                        className="goal-form-page__back-btn"
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
                        <PiArrowLeftBold sx={{ fontSize: 18 }} />
                    </IconButton>
                    <Typography
                        className="goal-form-page__header-title"
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
                    className="goal-form-page__save-btn"
                    variant="contained"
                    onClick={handleSave}
                    disabled={!draft.title.trim()}
                    size="small"
                    disableElevation
                    sx={{
                        background: category ? category.gradient : "#7c3aed",
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
                    {isEditing ? "Update Changes" : "Create Goal"}
                </Button>
            </Box>

            <Box className="goal-form-page__content" sx={{ px: 3, py: 2.5, overflow: "auto", flex: 1, bgcolor: "#ffffff" }}>
                <Stack className="goal-form-page__form" spacing={2.5}>
                    <Box className="goal-form-page__field">
                        <TextField
                            className="goal-form-page__title-input"
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

                    {categories.length > 0 && (
                        <Box className="goal-form-page__field">
                            <Typography className="goal-form-page__field-label" sx={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "hsl(240, 8%, 45%)",
                                mb: 0.5,
                                letterSpacing: "0.06em",
                            }}>
                                Category
                            </Typography>
                            <Box className="goal-form-page__category-grid" sx={{
                                display: "grid",
                                gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(5, 1fr)",
                                gap: 0.75,
                            }}>
                                {categories.map((item) => {
                                    const selected = draft.category === item.key;
                                    return (
                                        <Button
                                            key={item.key}
                                            className="goal-form-page__category-btn"
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
                                            <Typography className="goal-form-page__category-label" sx={{
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
                    )}

                    <Box className="goal-form-page__field">
                        <Typography className="goal-form-page__field-label" sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Description
                        </Typography>
                        <TextField
                            className="goal-form-page__description-input"
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
                                        borderColor: category ? category.progress : "#7c3aed",
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box className="goal-form-page__field">
                        <Typography className="goal-form-page__field-label" sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Icon
                        </Typography>
                        <Box className="goal-form-page__icon-grid" sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}>
                            {ICON_OPTIONS.map((option) => {
                                const selected = getIconKey(draft.emoji, category?.iconKey) === option.key;
                                return (
                                    <Tooltip key={option.key} title={option.label} arrow placement="top">
                                        <IconButton
                                            className="goal-form-page__icon-btn"
                                            onClick={() => updateDraft({ emoji: option.key })}
                                            size="small"
                                            disableRipple
                                            sx={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: "8px",
                                                border: `1.5px solid ${selected ? (category?.progress || "#7c3aed") : "hsl(240, 10%, 90%)"}`,
                                                bgcolor: selected ? (category?.soft || "#f5f3ff") : "transparent",
                                                color: selected ? (category?.text || "#7c3aed") : "hsl(240, 8%, 55%)",
                                                transition: "all 150ms ease",
                                                "&:hover": {
                                                    bgcolor: category?.soft || "#f5f3ff",
                                                    borderColor: category?.progress || "#7c3aed",
                                                },
                                            }}
                                        >
                                            <option.Icon style={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                );
                            })}
                        </Box>
                    </Box>

                    <Box className="goal-form-page__field" ref={calendarAnchorRef}>
                        <Typography className="goal-form-page__field-label" sx={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 45%)",
                            mb: 0.5,
                            letterSpacing: "0.06em",
                        }}>
                            Target Date
                        </Typography>
                        <Box
                            onClick={() => setCalendarOpen(true)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                py: 0.875,
                                borderRadius: "10px",
                                fontSize: 14,
                                bgcolor: "hsl(240, 20%, 98%)",
                                border: "1px solid hsl(240, 10%, 88%)",
                                cursor: "pointer",
                                color: draft.targetDate ? "hsl(240, 15%, 10%)" : "hsl(240, 10%, 65%)",
                                fontWeight: draft.targetDate ? 600 : 400,
                                transition: "border-color 150ms ease",
                                "&:hover": {
                                    borderColor: "hsl(240, 10%, 78%)",
                                },
                            }}
                        >
                            <IoCalendarNumber size={16} style={{ color: "hsl(240, 8%, 55%)", flexShrink: 0 }} />
                            {draft.targetDate ? dayjs(draft.targetDate).format("DD/MM/YYYY") : "DD/MM/YYYY"}
                            {draft.targetDate && (
                                <Box
                                    onClick={(e) => { e.stopPropagation(); updateDraft({ targetDate: "" }); }}
                                    sx={{
                                        ml: "auto",
                                        fontSize: 14,
                                        color: "hsl(240, 8%, 60%)",
                                        lineHeight: 1,
                                        "&:hover": { color: "#dc2626" },
                                    }}
                                >
                                    ×
                                </Box>
                            )}
                        </Box>
                        <Popper
                            open={calendarOpen}
                            anchorEl={calendarAnchorRef.current}
                            placement="bottom-start"
                            sx={{ zIndex: 1400 }}
                        >
                            <ClickAwayListener onClickAway={() => setCalendarOpen(false)}>
                                <Box sx={{
                                    mt: 0.5,
                                    bgcolor: "#fff",
                                    borderRadius: "14px",
                                    border: "1px solid hsl(240, 10%, 90%)",
                                    boxShadow: "0 8px 24px rgb(0 0 0 / .1)",
                                    overflow: "hidden",
                                    ".rdp-root": {
                                        "--rdp-accent-color": category?.progress || "#7c3aed",
                                        "--rdp-day-font-weight": 600,
                                        "--rdp-day-font-size": 13,
                                        "--rdp-day-width": 38,
                                        "--rdp-day-height": 38,
                                        "--rdp-today-color": category?.progress || "#7c3aed",
                                        "--rdp-selected-font-weight": 700,
                                        "--rdp-day-button-border-radius": "8px",
                                        "--rdp-outside-opacity": 0.4,
                                        "--rdp-disabled-opacity": 0.3,
                                    },
                                    ".rdp-month_grid": {
                                        width: "100%",
                                        px: 1.5,
                                        pb: 1.5,
                                    },
                                    ".rdp-month": {
                                        px: 1.5,
                                        pt: 1,
                                    },
                                    ".rdp-nav": {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        px: 1.5,
                                        pt: 1.25,
                                        pb: 0.5,
                                    },
                                    ".rdp-nav button": {
                                        width: 32,
                                        height: 32,
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        display: "grid",
                                        placeItems: "center",
                                        fontSize: 18,
                                        color: "hsl(240, 8%, 50%)",
                                        "&:hover": {
                                            bgcolor: "hsl(240, 20%, 95%)",
                                        },
                                    },
                                    ".rdp-month_label": {
                                        fontWeight: 700,
                                        fontSize: 15,
                                        fontFamily: "'Sora', sans-serif",
                                        color: "hsl(240, 15%, 10%)",
                                    },
                                    ".rdp-weekday": {
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "hsl(240, 8%, 50%)",
                                        pb: 0.5,
                                        textTransform: "none",
                                    },
                                    ".rdp-day_button": {
                                        borderRadius: "8px",
                                        fontWeight: 600,
                                        fontSize: 13,
                                        transition: "all 150ms ease",
                                        "&:hover": {
                                            bgcolor: "hsl(240, 20%, 95%) !important",
                                        },
                                        "&[data-selected]": {
                                            bgcolor: `${category?.progress || "#7c3aed"} !important`,
                                            color: "#fff",
                                            fontWeight: 700,
                                        },
                                        "&[data-today]:not([data-selected])": {
                                            border: `1px solid ${category?.progress || "#7c3aed"}`,
                                        },
                                    },
                                    ".rdp-weekdays": {
                                        px: 1.5,
                                    },
                                    ".rdp-chevron": {
                                        fill: "hsl(240, 8%, 50%)",
                                        width: 18,
                                        height: 18,
                                    },
                                }}>
                                    <DayPicker
                                        mode="single"
                                        selected={draft.targetDate ? dayjs(draft.targetDate).toDate() : undefined}
                                        onSelect={(date) => {
                                            updateDraft({ targetDate: date ? dayjs(date).format("YYYY-MM-DD") : "" });
                                            setCalendarOpen(false);
                                        }}
                                        defaultMonth={draft.targetDate ? dayjs(draft.targetDate).toDate() : new Date()}
                                        disabled={{ before: new Date() }}
                                        weekStartsOn={1}
                                    />
                                </Box>
                            </ClickAwayListener>
                        </Popper>
                    </Box>

                    <Box className="goal-form-page__field">
                        <Typography className="goal-form-page__field-label" sx={{
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
                                    items={draft.steps.map((s) => s.stepId || s._tempId)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Stack className="goal-form-page__steps-list" spacing={0.5} sx={{ mb: 1.5 }}>
                                        {draft.steps.map((step, idx) => {
                                            const stepId = step.stepId || step._tempId;
                                            const isEditingStep = editingStep && (editingStep.stepId === stepId || editingStep._tempId === stepId);
                                            return (
                                                <SortableFormStep
                                                    key={stepId}
                                                    step={step}
                                                    stepId={stepId}
                                                    isEditing={isEditingStep}
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

                        <Box className="goal-form-page__add-step" sx={{
                            display: "flex",
                            gap: 0.75,
                            alignItems: "flex-start",
                            pt: 0.8,
                        }}>
                            <TextField
                                className="goal-form-page__add-step-input"
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
                                            borderColor: category ? category.progress : "#7c3aed",
                                        },
                                    },
                                }}
                            />
                            <Button
                                className="goal-form-page__add-step-btn"
                                variant="contained"
                                onClick={handleAddStep}
                                disabled={!newStepText.trim()}
                                disableElevation
                                sx={{
                                    px: 0,
                                    borderRadius: "8px",
                                    background: category ? category.gradient : "#7c3aed",
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "0 2px 6px rgb(0 0 0 / .1)",
                                    },
                                    "&.Mui-disabled": {
                                        background: "hsl(240, 10%, 92%)",
                                        color: "hsl(240, 6%, 70%)",
                                    },
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>

                    <Box className="goal-form-page__spacer" sx={{ height: 2 }} />
                </Stack>
            </Box>
        </>
    );

    if (isOverlay) {
        return (
            <Dialog
                className="goal-form-dialog"
                open
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                fullScreen={isMobile}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: isMobile ? 0 : "10px",
                            minHeight: isMobile ? "100vh" : "auto",
                            maxHeight: isMobile ? "100vh" : "88vh",
                            bgcolor: "#fff",
                            m: isMobile ? 0 : 1.5,
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: isMobile
                                ? "none"
                                : "0 20px 60px rgb(0 0 0 / 12%), 0 8px 20px rgb(0 0 0 / 6%)",
                        },
                    },
                }}
            >
                {content}
            </Dialog>
        );
    }

    return (
        <Box className="goal-form-page" sx={{
            minHeight: "100vh",
            background: "hsl(240, 20%, 97%)",
            display: "flex",
            flexDirection: "column",
        }}>
            <Box className="goal-form-page__container" sx={{
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
            className={`goal-form-page__step ${isDragging ? "" : "group"}`}
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
                border: `1px solid ${isEditing ? (category?.progress || "#7c3aed") : "hsl(240, 10%, 92%)"}`,
                transition: "all 150ms ease",
                "&:hover": {
                    borderColor: isEditing ? (category?.progress || "#7c3aed") : "hsl(240, 10%, 82%)",
                },
            }}
        >
            <DragHandle
                activatorRef={setActivatorNodeRef}
                listeners={listeners}
                attributes={attributes}
            />

            <Box className="goal-form-page__step-index" sx={{
                width: 24,
                height: 24,
                borderRadius: "6px",
                background: category?.gradient || "#7c3aed",
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
                    className="goal-form-page__step-input"
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
                                borderColor: category?.progress || "#7c3aed",
                            },
                        },
                    }}
                />
            ) : (
                <Typography className="goal-form-page__step-text" sx={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: 500,
                    color: "hsl(240, 15%, 15%)",
                }}>
                    {step.text}
                </Typography>
            )}

            <Box className="goal-form-page__step-actions" sx={{ display: "flex", alignItems: "center", gap: 0.25, flexShrink: 0 }}>
                {isEditing ? (
                    <>
                        <Tooltip title="Save" arrow placement="top">
                            <IconButton
                                className="goal-form-page__step-save-btn"
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
                                <PiCheckBold sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel" arrow placement="top">
                            <IconButton
                                className="goal-form-page__step-cancel-btn"
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
                                <PiXBold sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    <>
                        <Tooltip title="Edit" arrow placement="top">
                            <IconButton
                                className="goal-form-page__step-edit-btn"
                                onClick={() => handleStartEditStep(step)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "#7c3aed",
                                    bgcolor: "hsla(0, 0%, 100%, 1.00)",
                                    "&:hover": {
                                        color: "#7c3aed",
                                        bgcolor: "hsl(262, 83%, 96%)",
                                    },
                                }}
                            >
                                <TbPencil size={15} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow placement="top">
                            <IconButton
                                className="goal-form-page__step-delete-btn"
                                onClick={() => handleRemoveStep(stepId)}
                                size="small"
                                disableRipple
                                sx={{
                                    p: 0.375,
                                    color: "#dc2626",
                                    bgcolor: "hsla(0, 0%, 100%, 1.00)",
                                    "&:hover": {
                                        color: "#dc2626",
                                        bgcolor: "hsl(0, 84%, 96%)",
                                    },
                                }}
                            >
                                <FiTrash size={16} />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Box>
        </Box>
    );
}

export default GoalFormPage;
