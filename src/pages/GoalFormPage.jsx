import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Add, ArrowBack, CalendarToday, Delete
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
                            bgcolor: "hsl(240, 10%, 92%)",
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
                            mb: 1,
                            textTransform: "uppercase",
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
                            mb: 1,
                            textTransform: "uppercase",
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
                            mb: 1,
                            textTransform: "uppercase",
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
                            mb: 1,
                            textTransform: "uppercase",
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
                            mb: 1,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                        }}>
                            Subtasks
                        </Typography>

                        {draft.steps.length > 0 && (
                            <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                                {draft.steps.map((step, idx) => (
                                    <Box
                                        key={step.stepId}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.25,
                                            py: 0.875,
                                            px: 1.25,
                                            borderRadius: "8px",
                                            bgcolor: "hsl(240, 20%, 98%)",
                                            border: "1px solid hsl(240, 10%, 92%)",
                                            transition: "all 150ms ease",
                                            "&:hover": {
                                                borderColor: "hsl(240, 10%, 82%)",
                                            }
                                        }}
                                    >
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
                                        <Typography sx={{
                                            flex: 1,
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: "hsl(240, 15%, 15%)",
                                        }}>
                                            {step.text}
                                        </Typography>
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
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        {/* Add Step Input */}
                        <Box sx={{
                            display: "flex",
                            gap: 0.75,
                            alignItems: "flex-start",
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
                                    minWidth: 38,
                                    width: 38,
                                    height: 38,
                                    px: 0,
                                    borderRadius: "8px",
                                    background: category.gradient,
                                    boxShadow: "none",
                                    "&:hover": {
                                        boxShadow: "0 2px 6px rgb(0 0 0 / .1)",
                                    },
                                }}
                            >
                                <Add sx={{ fontSize: 20 }} />
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

export default GoalFormPage;
