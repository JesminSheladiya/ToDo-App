import { Box, Typography } from "@mui/material";

function EmptyState() {

    return (
        <Box
            sx={{
                textAlign: "center",
                mt: 10
            }}
        >

            <Typography variant="h5">
                No Tasks Yet
            </Typography>

            <Typography color="gray">
                Start by creating your first task
            </Typography>

        </Box>
    );
}

export default EmptyState;