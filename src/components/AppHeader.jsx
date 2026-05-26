import { Add, TrackChangesRounded, ViewAgenda, ViewList } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import Stack from "./Stack";

function AppHeader({ categoryView, onToggleView, onCreate }) {
    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                bgcolor: "rgba(248, 248, 252, 0.92)",
                backdropFilter: "blur(14px)",
                borderBottom: "1px solid",
                borderColor: "divider"
            }}
        >
            <Container
                maxWidth="md"
                sx={{
                    px: { xs: 1.5, sm: 3 },
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    <TrackChangesRounded sx={{ color: "primary.main", fontSize: { xs: 22, sm: 26 } }} />
                    <Typography
                        sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            fontSize: { xs: 18, sm: 20 },
                            color: "text.primary",
                            whiteSpace: "nowrap"
                        }}
                    >
                        BeComing
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.75}>
                    <Button
                        variant={categoryView ? "outlined" : "contained"}
                        startIcon={categoryView ? <ViewList /> : <ViewAgenda />}
                        onClick={onToggleView}
                        size="small"
                        sx={{
                            minWidth: { xs: 40, sm: 118 },
                            px: { xs: 1, sm: 2 },
                            fontSize: { xs: 13, sm: 14 }
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                            {categoryView ? "List" : "Categories"}
                        </Box>
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        size="small"
                        sx={{
                            minWidth: { xs: 40, sm: 124 },
                            px: { xs: 1, sm: 2 },
                            fontSize: { xs: 13, sm: 14 }
                        }}
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
