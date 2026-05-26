import { useState } from "react";
import {
    CalendarToday, CheckCircle, Delete, Edit,
    ExpandLess, ExpandMore, RadioButtonUnchecked
} from "@mui/icons-material";
import {
    Box, Button, Chip, IconButton, LinearProgress,
    Paper, Tooltip, Typography
} from "@mui/material";
import { getCategory, getStepProgress, formatDate } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function GoalCard({ goal, onEdit, onDelete, onToggleGoal, onToggleStep }) {
    const [expanded, setExpanded] = useState(false);
    const category = getCategory(goal.category);
    const progress = getStepProgress(goal);
    const completed = goal.status === "completed" || goal.completed;
    const hasSteps = goal.steps?.length > 0;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                transition: "box-shadow 160ms ease",
                "&:hover": {
                    boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)"
                }
            }}
        >
            <Box sx={{ height: 3, background: category.gradient }} />

            <Box sx={{ p: { xs: 1.25, sm: 1.5 } }}>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                    <IconButton
                        onClick={() => onToggleGoal(goal)}
                        size="small"
                        sx={{ p: 0.5, mt: 0.25, "&:hover": { bgcolor: category.soft } }}
                    >
                        {completed ? (
                            <CheckCircle sx={{ color: category.text, fontSize: { xs: 20, sm: 22 } }} />
                        ) : (
                            <RadioButtonUnchecked sx={{ color: "text.disabled", fontSize: { xs: 20, sm: 22 } }} />
                        )}
                    </IconButton>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                            <RoundedGoalIcon
                                iconKey={goal.emoji}
                                fallbackKey={category.iconKey}
                                sx={{ color: category.text, fontSize: { xs: 20, sm: 22 } }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: 14, sm: 15 },
                                    color: completed ? "text.secondary" : "text.primary",
                                    textDecoration: completed ? "line-through" : "none",
                                    opacity: completed ? 0.65 : 1,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {goal.title}
                            </Typography>
                        </Stack>

                        {goal.description && (
                            <Typography
                                sx={{
                                    mt: 0.25,
                                    color: "text.secondary",
                                    fontSize: { xs: 12, sm: 13 },
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}
                            >
                                {goal.description}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 0.75 }}>
                            <Chip
                                size="small"
                                icon={(
                                    <RoundedGoalIcon
                                        iconKey={category.iconKey}
                                        sx={{ color: `${category.text} !important`, fontSize: "14px !important" }}
                                    />
                                )}
                                label={category.label}
                                sx={{
                                    height: 24,
                                    bgcolor: category.badgeBg,
                                    color: category.text,
                                    fontWeight: 800,
                                    fontSize: 11
                                }}
                            />

                            {goal.targetDate && (
                                <Stack direction="row" spacing={0.35} alignItems="center" sx={{ color: "text.secondary" }}>
                                    <CalendarToday sx={{ fontSize: 12 }} />
                                    <Typography sx={{ fontSize: 11 }}>
                                        {formatDate(goal.targetDate)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0} alignItems="center" sx={{ flexShrink: 0 }}>
                        <Tooltip title="Edit goal">
                            <IconButton onClick={() => onEdit(goal)} size="small" sx={{ p: 0.5 }}>
                                <Edit sx={{ fontSize: { xs: 18, sm: 20 } }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete goal">
                            <IconButton onClick={() => onDelete(goal)} size="small" color="error" sx={{ p: 0.5 }}>
                                <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
                            </IconButton>
                        </Tooltip>

                        {hasSteps && (
                            <Tooltip title={expanded ? "Hide steps" : "Show steps"}>
                                <IconButton onClick={() => setExpanded((value) => !value)} size="small" sx={{ p: 0.5 }}>
                                    {expanded ? (
                                        <ExpandLess sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                    ) : (
                                        <ExpandMore sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>

                {hasSteps && (
                    <Box sx={{ mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 700, whiteSpace: "nowrap" }}>
                                {goal.steps.filter((step) => step.done).length}/{goal.steps.length} steps
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    flex: 1,
                                    height: 6,
                                    borderRadius: 99,
                                    bgcolor: "action.hover",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: category.progress,
                                        borderRadius: 99
                                    }
                                }}
                            />
                        </Stack>

                        {expanded && (
                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                                {goal.steps.map((step) => (
                                    <Button
                                        key={step.stepId}
                                        variant="text"
                                        onClick={() => onToggleStep(goal, step.stepId)}
                                        size="small"
                                        startIcon={step.done ? (
                                            <CheckCircle sx={{ color: category.text, fontSize: 16 }} />
                                        ) : (
                                            <RadioButtonUnchecked sx={{ fontSize: 16 }} />
                                        )}
                                        sx={{
                                            justifyContent: "flex-start",
                                            color: step.done ? "text.secondary" : "text.primary",
                                            textDecoration: step.done ? "line-through" : "none",
                                            textTransform: "none",
                                            px: 0.5,
                                            py: 0.25,
                                            minHeight: 28,
                                            fontSize: 13,
                                            "&:hover": { bgcolor: category.soft }
                                        }}
                                    >
                                        {step.text}
                                    </Button>
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

export default GoalCard;
