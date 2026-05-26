import { Box, Typography } from "@mui/material";

function Stat({ label, value, color }) {
    return (
        <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
                sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 24,
                    fontWeight: 800,
                    color
                }}
            >
                {value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {label}
            </Typography>
        </Box>
    );
}

export default Stat;
