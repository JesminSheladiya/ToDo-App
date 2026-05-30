import { useState } from "react";
import { CheckCircle, Delete, Edit, ExpandMore, RadioButtonUnchecked } from "@mui/icons-material";
import {
    Box, Button, Checkbox, Collapse, IconButton, LinearProgress, Tooltip, Typography
} from "@mui/material";
import { getStepProgress } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";

function GoalRow({ goal, category, onEdit, onDelete, onToggleGoal, onToggleStep, isLast }) {
    const [expanded, setExpanded] = useState(false);
    const progress = getStepProgress(goal);
    const completed = goal.status === "completed" || goal.completed;
    const hasSteps = goal.steps?.length > 0;

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.25,
                    minHeight: 52,
                    transition: "background-color 150ms ease",
                    "&:hover": {
                        bgcolor: "hsl(240, 20%, 98%)",
                    },
                    borderBottom: isLast ? "none" : "1px solid hsl(240, 10%, 93%)",
                }}
            >
                {/* Checkbox */}
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
                            transition: "all 150ms ease",
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

                {/* Goal Icon */}
                <RoundedGoalIcon
                    iconKey={goal.emoji}
                    fallbackKey={category.iconKey}
                    sx={{ color: category.text, fontSize: 16, flexShrink: 0 }}
                />

                {/* Title & Steps Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: completed ? "hsl(240, 8%, 55%)" : "hsl(240, 15%, 10%)",
                            textDecoration: completed ? "line-through" : "none",
                            opacity: completed ? 0.6 : 1,
                            transition: "all 150ms ease",
                            lineHeight: 1.4,
                        }}
                    >
                        {goal.title}
                    </Typography>
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

                {/* Actions */}
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
                            <ExpandMore sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
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
                            <Edit sx={{ fontSize: 16 }} />
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
                            <Delete sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Expanded Steps */}
            {hasSteps && (
                <Collapse in={expanded} timeout={200}>
                    <Box sx={{
                        px: { xs: 5, sm: 6.5 },
                        py: 1,
                        bgcolor: "hsl(240, 20%, 98.5%)",
                        borderBottom: isLast ? "none" : "1px solid hsl(240, 10%, 93%)",
                    }}>
                        {goal.steps.map((step) => (
                            <Button
                                key={step.stepId}
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
                                    px: 0.75,
                                    py: 0.3,
                                    minHeight: 30,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    borderRadius: "6px",
                                    transition: "all 150ms ease",
                                    width: "100%",
                                    "&:hover": {
                                        bgcolor: "hsl(240, 20%, 96%)",
                                    },
                                }}
                            >
                                {step.text}
                            </Button>
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );
}

export default GoalRow;
