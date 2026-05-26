import { Box, Divider, LinearProgress, Paper, Typography } from "@mui/material";
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

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
            }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: "text.primary" }}>
                        Overall Progress
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: "primary.main" }}>
                        {overallProgress}%
                    </Typography>
                </Stack>

                <Box>
                    <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{
                            height: 10,
                            borderRadius: 99,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                                borderRadius: 99,
                                background: `linear-gradient(90deg, ${CATEGORIES[0].progress}, ${CATEGORIES[2].progress}, ${CATEGORIES[3].progress})`
                            }
                        }}
                    />
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                            {stats.completed}/{stats.total} goals completed
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                            {goals.reduce((s, g) => s + (g.steps?.filter((st) => st.done).length || 0), 0)}/
                            {goals.reduce((s, g) => s + (g.steps?.length || 0), 0)} steps done
                        </Typography>
                    </Stack>
                </Box>

                <Divider />

                <Stack direction="row" flexWrap="wrap" gap={1}>
                    {CATEGORIES.map((category) => {
                        const count = goals.filter((goal) => goal.category === category.key).length;

                        return (
                            <Stack key={category.key} direction="row" spacing={0.75} alignItems="center">
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: category.progress
                                    }}
                                />
                                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                                    {category.label}{" "}
                                    <Box component="strong" sx={{ color: "text.primary" }}>
                                        {count}
                                    </Box>
                                </Typography>
                            </Stack>
                        );
                    })}
                </Stack>

                <Divider />

                <Stack direction="row" spacing={2}>
                    <Stat label="Total Goals" value={stats.total} color="text.primary" />
                    <Stat label="Completed" value={stats.completed} color="#16a34a" />
                    <Stat label="In Progress" value={stats.inProgress} color="primary.main" />
                </Stack>
            </Stack>
        </Paper>
    );
}

export default ProgressSummary;
