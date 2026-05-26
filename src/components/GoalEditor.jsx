import {
    Add, CalendarToday, Close, Delete, FlagRounded
} from "@mui/icons-material";
import {
    Box, Button, Dialog, DialogContent, IconButton,
    InputAdornment, TextField, Tooltip, Typography
} from "@mui/material";
import { CATEGORIES, ICON_OPTIONS } from "../constants/goals";
import { getCategory, getIconKey } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function GoalEditor({
    open,
    draft,
    editingGoal,
    newStepText,
    onClose,
    onSave,
    onDraftChange,
    onNewStepTextChange,
    onAddStep,
    onRemoveStep
}) {
    const category = getCategory(draft.category);
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

    const updateDraft = (updates) => {
        onDraftChange(updates);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box sx={{ height: 8, background: category.gradient }} />
            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 22
                            }}
                        >
                            {editingGoal ? "Edit Goal" : "New Goal"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Stack>

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Choose an icon
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {ICON_OPTIONS.map((option) => {
                                const selected = getIconKey(draft.emoji, category.iconKey) === option.key;
                                const Icon = option.Icon;

                                return (
                                    <Tooltip key={option.key} title={option.label}>
                                        <IconButton
                                            onClick={() => updateDraft({ emoji: option.key })}
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 1,
                                                border: `2px solid ${selected ? category.progress : category.border}`,
                                                bgcolor: selected ? category.soft : "#ffffff",
                                                color: selected ? category.text : "text.secondary",
                                                boxShadow: selected ? "0 4px 12px rgba(15,23,42,0.12)" : "none",
                                                transition: "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
                                                "&:hover": {
                                                    bgcolor: category.badgeBg,
                                                    color: category.text,
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 4px 12px rgba(15,23,42,0.1)"
                                                }
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 22 }} />
                                        </IconButton>
                                    </Tooltip>
                                );
                            })}
                        </Stack>
                    </Box>

                    <TextField
                        label="Goal Title"
                        placeholder="Enter your goal title"
                        value={draft.title}
                        onChange={(event) => updateDraft({ title: event.target.value })}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />

                    <TextField
                        label="Description"
                        placeholder="Add a short description"
                        value={draft.description}
                        onChange={(event) => updateDraft({ description: event.target.value })}
                        multiline
                        rows={2}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Category
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
                                gap: 1
                            }}
                        >
                            {CATEGORIES.map((item) => {
                                const selected = draft.category === item.key;

                                return (
                                    <Button
                                        key={item.key}
                                        onClick={() => updateDraft({ category: item.key, emoji: draft.emoji || item.iconKey })}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                            p: 1.25,
                                            borderRadius: 1,
                                            border: `2px solid ${selected ? item.progress : "#e4e4e7"}`,
                                            bgcolor: selected ? item.soft : "white",
                                            color: selected ? item.text : "text.primary",
                                            textTransform: "none",
                                            minHeight: 78,
                                            boxShadow: selected ? "0 4px 12px rgba(15,23,42,0.08)" : "none",
                                            "&:hover": {
                                                bgcolor: item.soft,
                                                borderColor: item.progress
                                            }
                                        }}
                                    >
                                        <Stack alignItems="flex-start" spacing={0.25}>
                                            <RoundedGoalIcon
                                                iconKey={item.iconKey}
                                                sx={{ color: item.text, fontSize: 22 }}
                                            />
                                            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                                                {item.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: "text.secondary", textAlign: "left" }}>
                                                {item.sublabel}
                                            </Typography>
                                        </Stack>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>

                    <TextField
                        label="Target Date"
                        type="date"
                        value={draft.targetDate}
                        onChange={(event) => updateDraft({ targetDate: event.target.value })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarToday sx={{ color: category.text, fontSize: 18 }} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            ...fieldSx,
                            "& input[type='date']::-webkit-calendar-picker-indicator": {
                                cursor: "pointer",
                                opacity: 0.75
                            }
                        }}
                    />

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Steps / Sub-tasks
                        </Typography>

                        <Stack spacing={1} sx={{ mb: 1 }}>
                            {draft.steps.map((step, index) => (
                                <Stack
                                    key={step.stepId}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        bgcolor: "secondary.main",
                                        borderRadius: 1,
                                        px: 1.5,
                                        py: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            bgcolor: category.progress,
                                            color: "white",
                                            display: "grid",
                                            placeItems: "center",
                                            fontSize: 12,
                                            fontWeight: 800
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Typography sx={{ flex: 1, fontSize: 14 }}>
                                        {step.text}
                                    </Typography>
                                    <IconButton onClick={() => onRemoveStep(step.stepId)} size="small" color="error">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Stack>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <TextField
                                value={newStepText}
                                onChange={(event) => onNewStepTextChange(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        onAddStep();
                                    }
                                }}
                                placeholder="Add a step or milestone"
                                size="small"
                                fullWidth
                                sx={fieldSx}
                            />
                            <Button
                                variant="contained"
                                onClick={onAddStep}
                                sx={{
                                    minWidth: 44,
                                    px: 1.25,
                                    bgcolor: category.progress,
                                    "&:hover": {
                                        bgcolor: category.text
                                    }
                                }}
                            >
                                <Add />
                            </Button>
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onClose}
                            sx={{
                                py: 1.25,
                                borderColor: "divider",
                                color: "text.secondary",
                                bgcolor: "#ffffff",
                                "&:hover": {
                                    borderColor: category.border,
                                    bgcolor: category.soft,
                                    color: category.text
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onSave}
                            disabled={!draft.title.trim()}
                            startIcon={<FlagRounded />}
                            sx={{
                                py: 1.25,
                                background: category.gradient,
                                color: "#ffffff",
                                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.14)",
                                "&:hover": {
                                    boxShadow: "0 10px 22px rgba(15, 23, 42, 0.18)"
                                },
                                "&.Mui-disabled": {
                                    bgcolor: "#e4e4e7",
                                    background: "#e4e4e7",
                                    color: "#a1a1aa",
                                    boxShadow: "none"
                                }
                            }}
                        >
                            {editingGoal ? "Save Changes" : "Create Goal"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default GoalEditor;
