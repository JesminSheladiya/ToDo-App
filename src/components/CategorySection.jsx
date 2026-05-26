import { useState } from "react";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Box, Collapse, Divider, IconButton, LinearProgress,
    Paper, Tooltip, Typography
} from "@mui/material";
import GoalRow from "./GoalRow";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function CategorySection({
    category,
    goals,
    onCreate,
    onEdit,
    onDelete,
    onToggleGoal,
    onToggleStep
}) {
    const [expanded, setExpanded] = useState(true);
    const activeGoals = goals.filter((goal) => goal.status !== "completed");
    const completedGoals = goals.filter((goal) => goal.status === "completed");
    const totalSteps = goals.reduce((sum, goal) => sum + (goal.steps?.length || 0), 0);
    const doneSteps = goals.reduce(
        (sum, goal) => sum + (goal.steps?.filter((step) => step.done).length || 0),
        0
    );
    const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)"
            }}
        >
            <Box
                onClick={() => setExpanded((v) => !v)}
                sx={{
                    px: { xs: 1.5, sm: 2 },
                    py: 1.25,
                    cursor: "pointer",
                    transition: "background-color 120ms",
                    "&:hover": { bgcolor: "action.hover" }
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                            sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1,
                                background: category.gradient,
                                display: "grid",
                                placeItems: "center",
                                flexShrink: 0
                            }}
                        >
                            <RoundedGoalIcon
                                iconKey={category.iconKey}
                                sx={{ color: "white", fontSize: 16 }}
                            />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontWeight: 800,
                                    fontSize: 14,
                                    color: "text.primary",
                                    lineHeight: 1.2
                                }}
                            >
                                {category.label}
                            </Typography>
                            <Typography sx={{ color: "text.secondary", fontSize: 11, mt: 0.1 }}>
                                {category.sublabel} &middot; {goals.length} goal{goals.length !== 1 ? "s" : ""}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
                        {totalSteps > 0 && (
                            <Typography sx={{ fontSize: 12, fontWeight: 700, color: category.text }}>
                                {progress}%
                            </Typography>
                        )}

                        <Tooltip title={`Add ${category.label} goal`}>
                            <IconButton
                                onClick={(e) => { e.stopPropagation(); onCreate(category.key); }}
                                size="small"
                                sx={{
                                    color: category.text,
                                    bgcolor: category.soft,
                                    "&:hover": { bgcolor: category.badgeBg }
                                }}
                            >
                                <Add sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>

                        <IconButton size="small" sx={{ color: "text.secondary" }}>
                            {expanded ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
                        </IconButton>
                    </Stack>
                </Stack>

                {totalSteps > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            mt: 1,
                            height: 4,
                            borderRadius: 99,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                                bgcolor: category.progress,
                                borderRadius: 99
                            }
                        }}
                    />
                )}
            </Box>

            <Collapse in={expanded}>
                {goals.length === 0 ? (
                    <Box
                        onClick={() => onCreate(category.key)}
                        sx={{
                            mx: { xs: 1.25, sm: 1.75 },
                            mb: 1.25,
                            py: 2.5,
                            borderRadius: 1,
                            border: `2px dashed ${category.border}`,
                            textAlign: "center",
                            cursor: "pointer",
                            color: "text.secondary",
                            transition: "background-color 120ms",
                            "&:hover": { bgcolor: category.soft, color: "text.primary" }
                        }}
                    >
                        <RoundedGoalIcon
                            iconKey={category.iconKey}
                            sx={{ color: category.text, fontSize: 24, mb: 0.25 }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: 12 }}>
                            No {category.label.toLowerCase()} goals yet. Click to add one!
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ pb: 0.75 }}>
                        {activeGoals.map((goal) => (
                            <GoalRow
                                key={goal.id}
                                goal={goal}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleGoal={onToggleGoal}
                                onToggleStep={onToggleStep}
                            />
                        ))}

                        {completedGoals.length > 0 && (
                            <>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ px: { xs: 1.5, sm: 2 }, py: 0.5, opacity: 0.5 }}>
                                    <Divider sx={{ flex: 1 }} />
                                    <Typography sx={{ fontSize: 10, color: "text.secondary", fontWeight: 700, whiteSpace: "nowrap" }}>
                                        Completed ({completedGoals.length})
                                    </Typography>
                                    <Divider sx={{ flex: 1 }} />
                                </Stack>

                                <Box sx={{ opacity: 0.5 }}>
                                    {completedGoals.map((goal) => (
                                        <GoalRow
                                            key={goal.id}
                                            goal={goal}
                                            onEdit={onEdit}
                                            onDelete={onDelete}
                                            onToggleGoal={onToggleGoal}
                                            onToggleStep={onToggleStep}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </Collapse>
        </Paper>
    );
}

export default CategorySection;
