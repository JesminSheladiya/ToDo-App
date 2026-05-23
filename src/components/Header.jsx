import { Box, Typography } from "@mui/material";

function Header() {
    return (
        <Box sx={{ mb: 4 }}>
            <Typography
                variant="h3"
                fontWeight="bold"
            >
                GoalPath
            </Typography>

            <Typography
                variant="body1"
                color="gray"
            >
                Organize your tasks and stay productive
            </Typography>
        </Box>
    );
}

export default Header;