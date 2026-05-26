import {
    CheckCircle, Delete, Edit, RadioButtonUnchecked
} from "@mui/icons-material";
import {
    Box, Button, IconButton, LinearProgress, Tooltip, Typography
} from "@mui/material";
import { getCategory, getStepProgress } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function GoalRow({ goal, onEdit, onDelete, onToggleGoal, onToggleStep }) {
    const category = getCategory(goal.category);
    const progress = getStepProgress(goal);
    const completed = goal.status === "completed" || goal.completed;
    const hasSteps = goal.steps?.length > 0;

    return (
        <Box>
            <Stack
                direction="row"
                spacing={0.75}
                alignItems="center"
                sx={{
                    px: { xs: 1.25, sm: 1.75 },
                    py: 0.625,
                    minHeight: 40,
                    transition: "background-color 120ms",
                    "&:hover": { bgcolor: "action.hover" }
                }}
            >
                <IconButton
                    onClick={() => onToggleGoal(goal)}
                    size="small"
                    sx={{ p: 0.25, color: category.text }}
                >
                    {completed ? (
                        <CheckCircle sx={{ fontSize: 18 }} />
                    ) : (
                        <RadioButtonUnchecked sx={{ fontSize: 18, color: "text.disabled" }} />
                    )}
                </IconButton>

                <RoundedGoalIcon
                    iconKey={goal.emoji}
                    fallbackKey={category.iconKey}
                    sx={{ color: category.text, fontSize: 16, flexShrink: 0 }}
                />

                <Typography
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        fontSize: 13,
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: completed ? "text.secondary" : "text.primary",
                        textDecoration: completed ? "line-through" : "none"
                    }}
                >
                    {goal.title}
                </Typography>

                {hasSteps && (
                    <Typography sx={{ fontSize: 10, color: "text.secondary", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {goal.steps.filter((s) => s.done).length}/{goal.steps.length}
                    </Typography>
                )}

                <Box sx={{ display: "flex", flexShrink: 0 }}>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => onEdit(goal)} size="small" sx={{ p: 0.25 }}>
                            <Edit sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(goal)} size="small" color="error" sx={{ p: 0.25 }}>
                            <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Stack>

            {hasSteps && (
                <Box sx={{ px: { xs: 3.25, sm: 4.75 }, pb: 0.75 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: "text.secondary", fontWeight: 700 }}>
                            Subtask progress
                        </Typography>
                        <Box sx={{ flex: 1, maxWidth: 120 }}>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 4,
                                    borderRadius: 99,
                                    bgcolor: "action.hover",
                                    "& .MuiLinearProgress-bar": { bgcolor: category.progress, borderRadius: 99 }
                                }}
                            />
                        </Box>
                    </Stack>

                    <Stack spacing={0.25}>
                        {goal.steps.map((step) => (
                            <Button
                                key={step.stepId}
                                variant="text"
                                onClick={() => onToggleStep(goal, step.stepId)}
                                size="small"
                                startIcon={step.done ? (
                                    <CheckCircle sx={{ color: category.text, fontSize: 14 }} />
                                ) : (
                                    <RadioButtonUnchecked sx={{ fontSize: 14 }} />
                                )}
                                sx={{
                                    justifyContent: "flex-start",
                                    color: step.done ? "text.secondary" : "text.primary",
                                    textDecoration: step.done ? "line-through" : "none",
                                    textTransform: "none",
                                    px: 0.25,
                                    py: 0.1,
                                    minHeight: 22,
                                    fontSize: 12,
                                    "&:hover": { bgcolor: "action.hover" }
                                }}
                            >
                                {step.text}
                            </Button>
                        ))}
                    </Stack>
                </Box>
            )}

            {!hasSteps && completed && (
                <Box sx={{ px: { xs: 3.5, sm: 5 }, pb: 0.5 }}>
                    <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{ height: 3, borderRadius: 99, "& .MuiLinearProgress-bar": { bgcolor: category.progress, borderRadius: 99 } }}
                    />
                </Box>
            )}
        </Box>
    );
}

export default GoalRow;
