import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { fetchGoals } from "../store/goalsSlice";
import AppHeader from "../components/AppHeader";
import EmptyJourney from "../components/EmptyJourney";
import ProgressSummary from "../components/ProgressSummary";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";

function MainLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const goals = useSelector((state) => state.goals.items);
    const loading = useSelector((state) => state.goals.loading);
    const { handleOpenCreate } = useGoalActions();

    const categoryView = location.pathname !== "/list";

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);

    const stats = useMemo(() => {
        const total = goals.length;
        const completed = goals.filter((goal) => goal.completed || goal.status === "completed").length;
        const totalSteps = goals.reduce((sum, goal) => sum + (goal.steps?.length || 0), 0);
        const doneSteps = goals.reduce(
            (sum, goal) => sum + (goal.steps?.filter((step) => step.done).length || 0),
            0
        );

        return {
            total,
            completed,
            inProgress: total - completed,
            stepProgress: totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0
        };
    }, [goals]);

    return (
        <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #ffffff 0%, #f7f7fb 100%)" }}>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 2500,
                    style: {
                        borderRadius: 8,
                        background: "#18181b",
                        color: "#fafafa",
                        fontSize: 14,
                        fontWeight: 500
                    },
                    success: {
                        iconTheme: { primary: "#22c55e", secondary: "#fafafa" }
                    },
                    error: {
                        iconTheme: { primary: "#ef4444", secondary: "#fafafa" }
                    }
                }}
            />

            <AppHeader
                categoryView={categoryView}
                onToggleView={() => navigate(categoryView ? "/list" : "/")}
                onCreate={() => handleOpenCreate()}
            />

            <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
                <Stack spacing={2.5}>
                    <Box>
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: { xs: 26, sm: 36 },
                                fontWeight: 800,
                                color: "text.primary",
                                lineHeight: 1.15
                            }}
                        >
                            Your Goals
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: 13, sm: 14 } }}>
                            Track every dream, one step at a time.
                        </Typography>
                    </Box>

                    {stats.total > 0 && <ProgressSummary stats={stats} goals={goals} />}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : goals.length === 0 ? (
                        <EmptyJourney onCreate={() => handleOpenCreate()} />
                    ) : (
                        <Outlet />
                    )}
                </Stack>
            </Container>
        </Box>
    );
}

export default MainLayout;
