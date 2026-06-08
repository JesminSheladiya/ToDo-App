import { Box, LinearProgress, Typography } from "@mui/material";
import Stack from "./Stack";

function ProgressSummary({ stats, goals, categories }) {
    const overallProgress = goals.length > 0
        ? Math.round(
            goals.reduce((sum, g) => sum + (g.steps?.filter((s) => s.done).length || 0), 0) /
            Math.max(goals.reduce((sum, g) => sum + (g.steps?.length || 0), 0), 1) * 100
        )
        : 0;

    const doneSteps = goals.reduce((s, g) => s + (g.steps?.filter((st) => st.done).length || 0), 0);
    const totalSteps = goals.reduce((s, g) => s + (g.steps?.length || 0), 0);

    const pausedCount = goals.filter((g) => g.status === "paused").length;

    return (
        <Box sx={{
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid hsl(240, 10%, 90%)",
            overflow: "hidden",
            boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
        }}>
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

                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                    }}>
                        {categories.map((category) => {
                            const count = goals.filter((goal) => goal.category === category.key).length;
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

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: 1,
                    }}>
                        <Box sx={{
                            bgcolor: "hsl(240, 20%, 97%)",
                            borderRadius: "10px",
                            py: 1.25,
                            textAlign: "center",
                        }}>
                            <Typography sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 25,
                                color: "hsl(240, 15%, 10%)",
                                lineHeight: 1.2,
                            }}>
                                {stats.total}
                            </Typography>
                            <Typography sx={{
                                fontSize: 10,
                                color: "hsl(240, 8%, 50%)",
                                fontWeight: 500,
                                mt: 0.5,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}>
                                Total
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: "hsl(142, 76%, 96%)",
                            borderRadius: "10px",
                            py: 1.25,
                            textAlign: "center",
                        }}>
                            <Typography sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 25,
                                color: "#16a34a",
                                lineHeight: 1.2,
                            }}>
                                {stats.completed}
                            </Typography>
                            <Typography sx={{
                                fontSize: 10,
                                color: "#16a34a",
                                fontWeight: 500,
                                mt: 0.5,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}>
                                Done
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: "hsl(262, 83%, 96%)",
                            borderRadius: "10px",
                            py: 1.25,
                            textAlign: "center",
                        }}>
                            <Typography sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 25,
                                color: "#7c3aed",
                                lineHeight: 1.2,
                            }}>
                                {stats.inProgress - pausedCount}
                            </Typography>
                            <Typography sx={{
                                fontSize: 10,
                                color: "#7c3aed",
                                fontWeight: 500,
                                mt: 0.5,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}>
                                Active
                            </Typography>
                        </Box>
                        <Box sx={{
                            bgcolor: "hsl(39, 90%, 95%)",
                            borderRadius: "10px",
                            py: 1.25,
                            textAlign: "center",
                        }}>
                            <Typography sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 25,
                                color: "#d97706",
                                lineHeight: 1.2,
                            }}>
                                {pausedCount}
                            </Typography>
                            <Typography sx={{
                                fontSize: 10,
                                color: "#d97706",
                                fontWeight: 500,
                                mt: 0.5,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}>
                                Paused
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}

export default ProgressSummary;
