import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Add, ArrowBack, CalendarToday, Delete, FlagRounded
} from "@mui/icons-material";
import {
    Box, Button, Dialog, DialogContent, IconButton, InputAdornment,
    TextField, Tooltip, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CATEGORIES, ICON_OPTIONS, emptyDraft } from "../constants/goals";
import { createGoal, fetchGoals, updateGoal } from "../store/goalsSlice";
import { createId, getCategory, getIconKey, syncCompletion } from "../utils/goals";
import RoundedGoalIcon from "../components/RoundedGoalIcon";
import Stack from "../components/Stack";

function GoalFormPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const goals = useSelector((state) => state.goals.items);
    const loading = useSelector((state) => state.goals.loading);
    const isEditing = !!id;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    }, []);

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

    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            bgcolor: "#ffffff",
            transition: "border-color 160ms ease, box-shadow 160ms ease",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d4d4d8",
                borderWidth: 1
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: category.progress
            },
            "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${category.badgeBg}`
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: category.progress,
                borderWidth: 2
            }
        },
        "& .MuiInputBase-input::placeholder": {
            color: "#a1a1aa",
            fontWeight: 500,
            opacity: 1
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: category.text
        }
    };

    const content = (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 1.5, sm: 2 },
                    py: 0.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(14px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                }}
            >
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton onClick={handleClose} size="small">
                        <ArrowBack />
                    </IconButton>
                    <Typography
                        sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            fontSize: { xs: 16, sm: 18 },
                            color: "text.primary"
                        }}
                    >
                        {isEditing ? "Edit Goal" : "New Goal"}
                    </Typography>
                </Stack>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!draft.title.trim()}
                    startIcon={<FlagRounded />}
                    size="small"
                    sx={{
                        background: category.gradient,
                        color: "#fff",
                        fontSize: { xs: 12, sm: 13 },
                        px: { xs: 1.5, sm: 2 },
                        "&:hover": { boxShadow: "0 4px 12px rgba(15,23,42,0.2)" },
                        "&.Mui-disabled": {
                            bgcolor: "#e4e4e7",
                            background: "#e4e4e7",
                            color: "#a1a1aa"
                        }
                    }}
                >
                    {isEditing ? "Save" : "Create"}
                </Button>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.25 }}>
                    <Stack spacing={1.5}>
                        <Box>
                            <TextField
                                placeholder="Goal Title"
                                value={draft.title}
                                onChange={(e) => updateDraft({ title: e.target.value })}
                                fullWidth
                                required
                                variant="standard"
                                autoFocus
                                InputProps={{ disableUnderline: true }}
                                sx={{
                                    "& .MuiInputBase-input": {
                                        fontSize: { xs: 22, sm: 26 },
                                        fontWeight: 800,
                                        fontFamily: "'Sora', sans-serif",
                                        py: 1,
                                        color: "text.primary",
                                        "&::placeholder": { color: "#d4d4d8", opacity: 1 }
                                    }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Icon
                            </Typography>
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", pb: 0.5 }}>
                                {ICON_OPTIONS.map((option) => {
                                    const selected = getIconKey(draft.emoji, category.iconKey) === option.key;
                                    const Icon = option.Icon;
                                    return (
                                        <Tooltip key={option.key} title={option.label}>
                                            <IconButton
                                                onClick={() => updateDraft({ emoji: option.key })}
                                                size="small"
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    border: `2px solid ${selected ? category.progress : "#e4e4e7"}`,
                                                    bgcolor: selected ? category.soft : "transparent",
                                                    color: selected ? category.text : "text.secondary",
                                                    flexShrink: 0,
                                                    "&:hover": { bgcolor: category.badgeBg, color: category.text, borderColor: category.progress }
                                                }}
                                            >
                                                <Icon sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </Tooltip>
                                    );
                                })}
                            </Stack>
                        </Box>

                        <TextField
                            label="Description"
                                placeholder="Add a short description"
                                value={draft.description}
                                onChange={(e) => updateDraft({ description: e.target.value })}
                                multiline
                                rows={1}
                                minRows={1}
                            fullWidth
                            size="small"
                            sx={fieldSx}
                        />

                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Category
                            </Typography>
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0.75 }}>
                                {CATEGORIES.map((item) => {
                                    const selected = draft.category === item.key;
                                    return (
                                        <Button
                                            key={item.key}
                                            onClick={() => updateDraft({ category: item.key, emoji: draft.emoji || item.iconKey })}
                                            sx={{
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 0.25,
                                                p: 1,
                                                borderRadius: 1.5,
                                                border: `2px solid ${selected ? item.progress : "#e4e4e7"}`,
                                                bgcolor: selected ? item.soft : "white",
                                                color: selected ? item.text : "text.primary",
                                                textTransform: "none",
                                                minHeight: 64,
                                                "&:hover": { bgcolor: item.soft, borderColor: item.progress }
                                            }}
                                        >
                                            <RoundedGoalIcon iconKey={item.iconKey} sx={{ color: item.text, fontSize: 20 }} />
                                            <Typography sx={{ fontSize: 10, fontWeight: 800, textAlign: "center", lineHeight: 1.2 }}>
                                                {item.label}
                                            </Typography>
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Box>

                        <TextField
                            label="Target Date"
                            type="date"
                            value={draft.targetDate}
                            onChange={(e) => updateDraft({ targetDate: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarToday sx={{ color: category.text, fontSize: 16 }} />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                ...fieldSx,
                                "& input[type='date']::-webkit-calendar-picker-indicator": { cursor: "pointer", opacity: 0.75 }
                            }}
                        />

                        <Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary", mb: 1, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                Subtasks
                            </Typography>

                            {draft.steps.length > 0 && (
                                <Stack spacing={0.75} sx={{ mb: 1.5 }}>
                                    {draft.steps.map((step, idx) => (
                                        <Box
                                            key={step.stepId}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                                p: 0.75,
                                                borderRadius: 1.5,
                                                bgcolor: "white",
                                                border: "1px solid",
                                                borderColor: "divider",
                                                transition: "box-shadow 120ms",
                                                "&:hover": { boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 26,
                                                    height: 26,
                                                    borderRadius: "50%",
                                                    background: category.gradient,
                                                    color: "white",
                                                    display: "grid",
                                                    placeItems: "center",
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                    flexShrink: 0
                                                }}
                                            >
                                                {idx + 1}
                                            </Box>
                                            <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                                                {step.text}
                                            </Typography>
                                            <IconButton onClick={() => handleRemoveStep(step.stepId)} size="small" color="error" sx={{ p: 0.25 }}>
                                                <Delete sx={{ fontSize: 18 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            )}

                            <Stack direction="row" spacing={1}>
                                <TextField
                                    value={newStepText}
                                    onChange={(e) => setNewStepText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") { e.preventDefault(); handleAddStep(); }
                                    }}
                                    placeholder="Add a subtask..."
                                    size="small"
                                    fullWidth
                                    sx={fieldSx}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleAddStep}
                                    sx={{
                                        minWidth: 44,
                                        px: 1.25,
                                        bgcolor: category.progress,
                                        "&:hover": { bgcolor: category.text }
                                    }}
                                >
                                    <Add />
                                </Button>
                            </Stack>
                        </Box>

                        <Box sx={{ height: 8 }} />
                    </Stack>
                </Box>
            </DialogContent>
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
                        borderRadius: isMobile ? 0 : 3,
                        minHeight: isMobile ? "100vh" : "auto",
                        maxHeight: isMobile ? "100vh" : "90vh",
                        bgcolor: "#ffffff",
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                {content}
            </Dialog>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #ffffff 0%, #f7f7fb 100%)", display: "flex", flexDirection: "column" }}>
            {content}
        </Box>
    );
}

export default GoalFormPage;
