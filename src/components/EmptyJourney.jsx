import { Add, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

function EmptyJourney({ onCreate }) {
    return (
        <Box sx={{ textAlign: "center", py: { xs: 6, sm: 10 } }}>
            <RocketLaunchRounded sx={{ color: "primary.main", fontSize: { xs: 48, sm: 64 }, mb: 1 }} />
            <Typography
                sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: 20, sm: 22 },
                    mb: 0.75
                }}
            >
                Start Your Journey!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5, fontSize: { xs: 13, sm: 14 } }}>
                Set your first goal and start achieving greatness.
            </Typography>
            <Button variant="contained" size="large" startIcon={<Add />} onClick={onCreate} sx={{ fontSize: { xs: 14, sm: 15 } }}>
                Create First Goal
            </Button>
        </Box>
    );
}

export default EmptyJourney;
