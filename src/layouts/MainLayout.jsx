import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { fetchGoals } from "../store/goalsSlice";
import {
    addDraftStep, closeEditor, removeDraftStep, setNewStepText, updateDraft
} from "../store/uiSlice";
import AppHeader from "../components/AppHeader";
import EmptyJourney from "../components/EmptyJourney";
import GoalEditor from "../components/GoalEditor";
import ProgressSummary from "../components/ProgressSummary";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";

function MainLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const goals = useSelector((state) => state.goals.items);
    const loading = useSelector((state) => state.goals.loading);
    const {
        editorOpen, editingGoal, draft, newStepText
    } = useSelector((state) => state.ui);
    const {
        handleOpenCreate, handleSave
    } = useGoalActions();

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
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppHeader
                categoryView={categoryView}
                onToggleView={() => navigate(categoryView ? "/list" : "/")}
                onCreate={() => handleOpenCreate()}
            />

            <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography
                            component="h1"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontSize: { xs: 30, sm: 36 },
                                fontWeight: 800,
                                color: "text.primary",
                                lineHeight: 1.15
                            }}
                        >
                            Your Goals
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            Track every dream, one step at a time.
                        </Typography>
                    </Box>

                    {stats.total > 0 && <ProgressSummary stats={stats} goals={goals} />}

                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                            <CircularProgress />
                        </Box>
                    ) : goals.length === 0 ? (
                        <EmptyJourney onCreate={() => handleOpenCreate()} />
                    ) : (
                        <Outlet />
                    )}
                </Stack>
            </Container>

            <GoalEditor
                open={editorOpen}
                draft={draft}
                editingGoal={editingGoal}
                newStepText={newStepText}
                onClose={() => dispatch(closeEditor())}
                onSave={handleSave}
                onDraftChange={(updates) => dispatch(updateDraft(updates))}
                onNewStepTextChange={(value) => dispatch(setNewStepText(value))}
                onAddStep={() => dispatch(addDraftStep())}
                onRemoveStep={(stepId) => dispatch(removeDraftStep(stepId))}
            />
        </Box>
    );
}

export default MainLayout;
