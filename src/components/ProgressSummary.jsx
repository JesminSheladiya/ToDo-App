import { Box, Divider, Paper, Typography } from "@mui/material";
import { CATEGORIES } from "../constants/goals";
import Stack from "./Stack";
import Stat from "./Stat";

function ProgressSummary({ stats, goals }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
            }}
        >
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                        Overall Progress
                    </Typography>

                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: "primary.main" }}>
                        {stats.stepProgress}%
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ height: 12, bgcolor: "secondary.main", borderRadius: 99, overflow: "hidden" }}>
                    {CATEGORIES.map((category) => {
                        const count = goals.filter((goal) => goal.category === category.key).length;
                        const width = stats.total > 0 ? (count / stats.total) * 100 : 0;

                        return width > 0 ? (
                            <Box
                                key={category.key}
                                title={`${category.label}: ${count} goals`}
                                sx={{
                                    width: `${width}%`,
                                    bgcolor: category.progress,
                                    borderRadius: 99
                                }}
                            />
                        ) : null;
                    })}
                </Stack>

                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                    {CATEGORIES.map((category) => {
                        const count = goals.filter((goal) => goal.category === category.key).length;

                        return (
                            <Stack key={category.key} direction="row" spacing={0.75} alignItems="center">
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        bgcolor: category.progress
                                    }}
                                />
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
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
