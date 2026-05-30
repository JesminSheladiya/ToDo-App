import { Box, LinearProgress, Typography } from "@mui/material";
import { CATEGORIES } from "../constants/goals";
import Stack from "./Stack";
import Stat from "./Stat";

function ProgressSummary({ stats, goals }) {
    const overallProgress = goals.length > 0
        ? Math.round(
            goals.reduce((sum, g) => sum + (g.steps?.filter((s) => s.done).length || 0), 0) /
            Math.max(goals.reduce((sum, g) => sum + (g.steps?.length || 0), 0), 1) * 100
          )
        : 0;

    const doneSteps = goals.reduce((s, g) => s + (g.steps?.filter((st) => st.done).length || 0), 0);
    const totalSteps = goals.reduce((s, g) => s + (g.steps?.length || 0), 0);

    return (
        <Box sx={{
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid hsl(240, 10%, 90%)",
            overflow: "hidden",
            boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
        }}>
            {/* Gradient Top Bar */}
            <Box sx={{
                height: 3,
                background: `linear-gradient(90deg, 
                    hsl(var(--short-term)), 
                    hsl(var(--mid-term)), 
                    hsl(var(--long-term)), 
                    hsl(var(--very-long-term)), 
                    hsl(var(--life-goal))
                )`,
            }} />

            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack spacing={2}>
                    {/* Progress Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: "hsl(240, 15%, 10%)",
                            fontFamily: "'Sora', sans-serif",
                        }}>
                            Overall Progress
                        </Typography>
                        <Box sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "8px",
                            background: `linear-gradient(135deg, #7c3aed, #a855f7)`,
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 13,
                            fontFamily: "'Sora', sans-serif",
                        }}>
                            {overallProgress}%
                        </Box>
                    </Stack>

                    {/* Progress Bar */}
                    <Box>
                        <LinearProgress
                            variant="determinate"
                            value={overallProgress}
                            sx={{
                                height: 8,
                                borderRadius: 99,
                                bgcolor: "hsl(240, 10%, 94%)",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 99,
                                    background: `linear-gradient(90deg, 
                                        hsl(var(--short-term)), 
                                        hsl(var(--long-term)), 
                                        hsl(var(--very-long-term)), 
                                        hsl(var(--life-goal))
                                    )`,
                                    transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                                }
                            }}
                        />
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                            <Typography sx={{
                                fontSize: 12,
                                color: "hsl(240, 8%, 50%)",
                                fontWeight: 500,
                            }}>
                                {stats.completed}/{stats.total} goals completed
                            </Typography>
                            <Typography sx={{
                                fontSize: 12,
                                color: "hsl(240, 8%, 50%)",
                                fontWeight: 500,
                            }}>
                                {doneSteps}/{totalSteps} steps done
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Category Chips */}
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                    }}>
                        {CATEGORIES.map((category) => {
                            const count = goals.filter((goal) => goal.category === category.key).length;
                            if (count === 0) return null;
                            return (
                                <Box
                                    key={category.key}
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 0.75,
                                        px: 1.25,
                                        py: 0.5,
                                        borderRadius: "8px",
                                        bgcolor: category.soft,
                                        border: `1px solid ${category.border}`,
                                    }}
                                >
                                    <Box sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: category.gradient,
                                        flexShrink: 0,
                                    }} />
                                    <Typography sx={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: category.text,
                                    }}>
                                        {category.label}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: 12,
                                        fontWeight: 800,
                                        color: category.text,
                                        opacity: 0.8,
                                    }}>
                                        {count}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Stats Row */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "hsl(240, 20%, 97%)",
                        borderRadius: "12px",
                        p: 1.5,
                        gap: 0,
                    }}>
                        <Stat label="Total Goals" value={stats.total} color="hsl(240, 15%, 10%)" />
                        <Box sx={{ width: 1, height: 36, bgcolor: "hsl(240, 10%, 88%)" }} />
                        <Stat label="Completed" value={stats.completed} color="#16a34a" />
                        <Box sx={{ width: 1, height: 36, bgcolor: "hsl(240, 10%, 88%)" }} />
                        <Stat label="In Progress" value={stats.inProgress} color="#7c3aed" />
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default ProgressSummary;
