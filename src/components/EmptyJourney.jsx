import { Add, RocketLaunchRounded } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

function EmptyJourney({ onCreate }) {
    return (
        <Box sx={{ textAlign: "center", py: 10 }}>
            <RocketLaunchRounded sx={{ color: "primary.main", fontSize: 64, mb: 1 }} />
            <Typography
                sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: 22,
                    mb: 1
                }}
            >
                Start Your Journey!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Set your first goal and start achieving greatness.
            </Typography>
            <Button variant="contained" size="large" startIcon={<Add />} onClick={onCreate}>
                Create First Goal
            </Button>
        </Box>
    );
}

export default EmptyJourney;
