import { Add } from "@mui/icons-material";
import { Box, Divider, IconButton, LinearProgress, Paper, Tooltip, Typography } from "@mui/material";
import GoalCard from "./GoalCard";
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
    const activeGoals = goals.filter((goal) => goal.status !== "completed");
    const completedGoals = goals.filter((goal) => goal.status === "completed");
    const totalSteps = goals.reduce((sum, goal) => sum + (goal.steps?.length || 0), 0);
    const doneSteps = goals.reduce(
        (sum, goal) => sum + (goal.steps?.filter((step) => step.done).length || 0),
        0
    );
    const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

    return (
        <Box component="section">
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    background: category.gradient,
                    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12)"
                }}
            >
                <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "rgba(255,255,255,0.2)",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 22
                            }}
                        >
                            <RoundedGoalIcon
                                iconKey={category.iconKey}
                                sx={{ color: "white", fontSize: 24 }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontWeight: 800,
                                    color: "white",
                                    lineHeight: 1
                                }}
                            >
                                {category.label}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12, mt: 0.5 }}>
                                {category.sublabel}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "white", fontWeight: 800, lineHeight: 1 }}>
                                {goals.length}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12 }}>
                                goals
                            </Typography>
                        </Box>

                        {totalSteps > 0 && (
                            <Box sx={{ textAlign: "right" }}>
                                <Typography sx={{ color: "white", fontWeight: 800, lineHeight: 1 }}>
                                    {progress}%
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12 }}>
                                    done
                                </Typography>
                            </Box>
                        )}

                        <Tooltip title={`Add ${category.label} goal`}>
                            <IconButton
                                onClick={() => onCreate(category.key)}
                                sx={{
                                    color: "white",
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" }
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                {totalSteps > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            mt: 1.5,
                            height: 6,
                            borderRadius: 99,
                            bgcolor: "rgba(255,255,255,0.25)",
                            "& .MuiLinearProgress-bar": {
                                bgcolor: "rgba(255,255,255,0.85)"
                            }
                        }}
                    />
                )}
            </Box>

            {goals.length === 0 ? (
                <Paper
                    elevation={0}
                    onClick={() => onCreate(category.key)}
                    sx={{
                        p: 4,
                        borderRadius: 1,
                        border: `2px dashed ${category.border}`,
                        textAlign: "center",
                        cursor: "pointer",
                        color: "text.secondary",
                        transition: "background-color 160ms ease",
                        "&:hover": {
                            bgcolor: category.soft,
                            color: "text.primary"
                        }
                    }}
                >
                    <RoundedGoalIcon
                        iconKey={category.iconKey}
                        sx={{ color: category.text, fontSize: 36, mb: 1 }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                        No {category.label.toLowerCase()} goals yet. Click to add one!
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={1.5}>
                    {activeGoals.map((goal) => (
                        <GoalCard
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
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.65 }}>
                                <Divider sx={{ flex: 1, borderColor: category.border }} />
                                <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700 }}>
                                    Completed ({completedGoals.length})
                                </Typography>
                                <Divider sx={{ flex: 1, borderColor: category.border }} />
                            </Stack>

                            <Stack spacing={1.5} sx={{ opacity: 0.65 }}>
                                {completedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleGoal={onToggleGoal}
                                        onToggleStep={onToggleStep}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}
                </Stack>
            )}
        </Box>
    );
}

export default CategorySection;
