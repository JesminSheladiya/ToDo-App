import { Add, TrackChangesRounded, ViewAgenda, ViewList } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import Stack from "./Stack";

function AppHeader({ categoryView, onToggleView, onCreate }) {
    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                bgcolor: "rgba(248, 248, 252, 0.9)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid",
                borderColor: "divider"
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <TrackChangesRounded sx={{ color: "primary.main" }} />
                    <Typography
                        sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            fontSize: 20,
                            color: "text.primary",
                            whiteSpace: "nowrap"
                        }}
                    >
                        BeComing
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant={categoryView ? "outlined" : "contained"}
                        startIcon={categoryView ? <ViewList /> : <ViewAgenda />}
                        onClick={onToggleView}
                        sx={{ px: { xs: 1.5, sm: 2 }, minWidth: { xs: 42, sm: 118 } }}
                    >
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                            {categoryView ? "List" : "Categories"}
                        </Box>
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        sx={{ px: { xs: 1.5, sm: 2 }, minWidth: { xs: 42, sm: 124 } }}
                    >
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                            New Goal
                        </Box>
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}

export default AppHeader;
