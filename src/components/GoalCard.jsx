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
                border: `2px solid ${category.border}`,
                bgcolor: category.soft,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
            }}
        >
            <Box sx={{ height: 6, background: category.gradient }} />

            <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconButton onClick={() => onToggleGoal(goal)} sx={{ p: 0.25, mt: 0.25 }}>
                        {completed ? (
                            <CheckCircle sx={{ color: category.text }} />
                        ) : (
                            <RadioButtonUnchecked sx={{ color: "text.disabled" }} />
                        )}
                    </IconButton>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <RoundedGoalIcon
                                iconKey={goal.emoji}
                                fallbackKey={category.iconKey}
                                sx={{ color: category.text, fontSize: 24 }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 800,
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
                                    mt: 0.5,
                                    color: "text.secondary",
                                    fontSize: 14,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}
                            >
                                {goal.description}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
                            <Chip
                                size="small"
                                icon={(
                                    <RoundedGoalIcon
                                        iconKey={category.iconKey}
                                        sx={{ color: `${category.text} !important`, fontSize: "16px !important" }}
                                    />
                                )}
                                label={category.label}
                                sx={{
                                    bgcolor: category.badgeBg,
                                    color: category.text,
                                    fontWeight: 800
                                }}
                            />

                            {goal.targetDate && (
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                                    <CalendarToday sx={{ fontSize: 14 }} />
                                    <Typography sx={{ fontSize: 12 }}>
                                        {formatDate(goal.targetDate)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.25} alignItems="center">
                        <Tooltip title="Edit goal">
                            <IconButton onClick={() => onEdit(goal)} size="small">
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete goal">
                            <IconButton onClick={() => onDelete(goal)} size="small" color="error">
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {hasSteps && (
                            <Tooltip title={expanded ? "Hide steps" : "Show steps"}>
                                <IconButton onClick={() => setExpanded((value) => !value)} size="small">
                                    {expanded ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>

                {hasSteps && (
                    <Box sx={{ pl: { xs: 0, sm: 5 }, mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700 }}>
                                {goal.steps.filter((step) => step.done).length}/{goal.steps.length} steps
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 99,
                                    bgcolor: "rgba(255,255,255,0.65)",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: category.progress
                                    }
                                }}
                            />
                        </Stack>

                        {expanded && (
                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                {goal.steps.map((step) => (
                                    <Button
                                        key={step.stepId}
                                        variant="text"
                                        onClick={() => onToggleStep(goal, step.stepId)}
                                        startIcon={step.done ? (
                                            <CheckCircle sx={{ color: category.text }} />
                                        ) : (
                                            <RadioButtonUnchecked />
                                        )}
                                        sx={{
                                            justifyContent: "flex-start",
                                            color: step.done ? "text.secondary" : "text.primary",
                                            textDecoration: step.done ? "line-through" : "none",
                                            textTransform: "none",
                                            px: 0,
                                            minHeight: 28
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
