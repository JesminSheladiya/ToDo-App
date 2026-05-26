import { useEffect, useMemo, useState } from "react";

import {
    Add,
    CalendarToday,
    CheckCircle,
    Close,
    Delete,
    DirectionsRunRounded,
    Edit,
    EmojiEventsRounded,
    ExpandLess,
    ExpandMore,
    FavoriteRounded,
    FlagRounded,
    FlashOnRounded,
    FitnessCenterRounded,
    FlightTakeoffRounded,
    LightbulbRounded,
    LocalFireDepartmentRounded,
    MenuBookRounded,
    PaletteRounded,
    RadioButtonUnchecked,
    RocketLaunchRounded,
    SavingsRounded,
    Search,
    SelfImprovementRounded,
    SpaRounded,
    StarRounded,
    TrackChangesRounded,
    ViewAgenda,
    ViewList
} from "@mui/icons-material";

import {
    Box,
    Button,
    Chip,
    CircularProgress,   
    Container,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    InputAdornment,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Stack as MuiStack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";

import api from "../api/api";

function Stack({ alignItems, flexWrap, justifyContent, sx, ...props }) {
    return (
        <MuiStack
            {...props}
            sx={{
                ...(alignItems ? { alignItems } : {}),
                ...(flexWrap ? { flexWrap } : {}),
                ...(justifyContent ? { justifyContent } : {}),
                ...sx
            }}
        />
    );
}

const ICON_OPTIONS = [
    { key: "target", label: "Target", Icon: TrackChangesRounded },
    { key: "flash", label: "Energy", Icon: FlashOnRounded },
    { key: "growth", label: "Growth", Icon: SpaRounded },
    { key: "launch", label: "Launch", Icon: RocketLaunchRounded },
    { key: "star", label: "Star", Icon: StarRounded },
    { key: "strength", label: "Strength", Icon: FitnessCenterRounded },
    { key: "learning", label: "Learning", Icon: MenuBookRounded },
    { key: "idea", label: "Idea", Icon: LightbulbRounded },
    { key: "achievement", label: "Achievement", Icon: EmojiEventsRounded },
    { key: "heart", label: "Heart", Icon: FavoriteRounded },
    { key: "creative", label: "Creative", Icon: PaletteRounded },
    { key: "fitness", label: "Fitness", Icon: DirectionsRunRounded },
    { key: "travel", label: "Travel", Icon: FlightTakeoffRounded },
    { key: "money", label: "Money", Icon: SavingsRounded },
    { key: "mindful", label: "Mindful", Icon: SelfImprovementRounded },
    { key: "fire", label: "Momentum", Icon: LocalFireDepartmentRounded }
];

const LEGACY_ICON_MAP = {
    "\uD83C\uDFAF": "target",
    "\u26A1": "flash",
    "\uD83C\uDF31": "growth",
    "\uD83D\uDE80": "launch",
    "\u2B50": "star",
    "\uD83D\uDCAA": "strength",
    "\uD83D\uDCDA": "learning",
    "\uD83D\uDCA1": "idea",
    "\uD83C\uDFC6": "achievement",
    "\u2764\uFE0F": "heart",
    "\uD83C\uDFA8": "creative",
    "\uD83C\uDFC3": "fitness",
    "\u2708\uFE0F": "travel",
    "\uD83D\uDCB0": "money",
    "\uD83E\uDDD8": "mindful",
    "\uD83D\uDD25": "fire"
};

const CATEGORIES = [
    {
        key: "short_term",
        label: "Short Term",
        sublabel: "Days to weeks",
        iconKey: "flash",
        gradient: "linear-gradient(135deg, #fb923c, #f87171)",
        soft: "#fff7ed",
        border: "#fed7aa",
        badgeBg: "#ffedd5",
        text: "#ea580c",
        progress: "#fb923c"
    },
    {
        key: "mid_term",
        label: "Mid Term",
        sublabel: "Weeks to months",
        iconKey: "target",
        gradient: "linear-gradient(135deg, #facc15, #f59e0b)",
        soft: "#fefce8",
        border: "#fef08a",
        badgeBg: "#fef3c7",
        text: "#ca8a04",
        progress: "#facc15"
    },
    {
        key: "long_term",
        label: "Long Term",
        sublabel: "6 months to 1 year",
        iconKey: "growth",
        gradient: "linear-gradient(135deg, #4ade80, #10b981)",
        soft: "#f0fdf4",
        border: "#bbf7d0",
        badgeBg: "#dcfce7",
        text: "#16a34a",
        progress: "#4ade80"
    },
    {
        key: "very_long_term",
        label: "Very Long Term",
        sublabel: "1 to 5 years",
        iconKey: "launch",
        gradient: "linear-gradient(135deg, #60a5fa, #6366f1)",
        soft: "#eff6ff",
        border: "#bfdbfe",
        badgeBg: "#dbeafe",
        text: "#2563eb",
        progress: "#60a5fa"
    },
    {
        key: "life_goal",
        label: "Life Goal",
        sublabel: "5+ years / lifetime",
        iconKey: "star",
        gradient: "linear-gradient(135deg, #c084fc, #ec4899)",
        soft: "#faf5ff",
        border: "#e9d5ff",
        badgeBg: "#f3e8ff",
        text: "#9333ea",
        progress: "#a855f7"
    }
];

const emptyDraft = {
    title: "",
    description: "",
    category: "short_term",
    targetDate: "",
    emoji: "target",
    steps: [],
    status: "active",
    completed: false
};

function getCategory(categoryKey) {
    return CATEGORIES.find((category) => category.key === categoryKey) || CATEGORIES[0];
}

function getIconKey(iconKey, fallbackKey = "target") {
    const normalizedKey = LEGACY_ICON_MAP[iconKey] || iconKey;

    return ICON_OPTIONS.some((option) => option.key === normalizedKey)
        ? normalizedKey
        : fallbackKey;
}

function getIconOption(iconKey, fallbackKey = "target") {
    const normalizedKey = getIconKey(iconKey, fallbackKey);

    return ICON_OPTIONS.find((option) => option.key === normalizedKey) || ICON_OPTIONS[0];
}

function RoundedGoalIcon({ iconKey, fallbackKey, sx }) {
    const Icon = getIconOption(iconKey, fallbackKey).Icon;

    return <Icon sx={sx} />;
}

function createId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeGoal(goal) {
    const category = getCategory(goal.category);
    const steps = Array.isArray(goal.steps)
        ? goal.steps.map((step) => ({
            stepId: step.stepId || step.id || createId(),
            text: step.text || "",
            done: Boolean(step.done)
        }))
        : [];
    const completed = Boolean(goal.completed || goal.status === "completed");

    return {
        ...goal,
        category: category.key,
        emoji: getIconKey(goal.emoji, category.iconKey),
        targetDate: goal.targetDate || "",
        steps,
        status: completed ? "completed" : (goal.status || "active"),
        completed
    };
}

function getStepProgress(goal) {
    const steps = goal.steps || [];

    if (steps.length === 0) {
        return goal.completed ? 100 : 0;
    }

    return Math.round((steps.filter((step) => step.done).length / steps.length) * 100);
}

function formatDate(value) {
    if (!value) return "";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(`${value}T00:00:00`));
}

function syncCompletion(goal) {
    const steps = goal.steps || [];
    const completed = steps.length > 0
        ? steps.every((step) => step.done)
        : Boolean(goal.completed || goal.status === "completed");

    return {
        ...goal,
        completed,
        status: completed ? "completed" : "active"
    };
}

function Dashboard() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [draft, setDraft] = useState(emptyDraft);
    const [newStepText, setNewStepText] = useState("");
    const [categoryView, setCategoryView] = useState(true);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        setLoading(true);

        try {
            const response = await api.get("/tasks");
            const data = Array.isArray(response?.data) ? response.data : [];

            setGoals(data.map(normalizeGoal));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const filteredGoals = useMemo(() => {
        return goals.filter((goal) => {
            const matchesQuery = goal.title.toLowerCase().includes(query.toLowerCase());
            const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter;
            const matchesStatus = statusFilter === "all" || goal.status === statusFilter;

            return matchesQuery && matchesCategory && matchesStatus;
        });
    }, [goals, query, categoryFilter, statusFilter]);

    const openCreateModal = (category = "short_term") => {
        const selectedCategory = getCategory(category);

        setEditingGoal(null);
        setDraft({
            ...emptyDraft,
            category: selectedCategory.key,
            emoji: selectedCategory.iconKey
        });
        setNewStepText("");
        setEditorOpen(true);
    };

    const openEditModal = (goal) => {
        setEditingGoal(goal);
        setDraft(normalizeGoal(goal));
        setNewStepText("");
        setEditorOpen(true);
    };

    const closeEditor = () => {
        setEditorOpen(false);
        setEditingGoal(null);
        setDraft(emptyDraft);
        setNewStepText("");
    };

    const saveGoal = async () => {
        const goalToSave = syncCompletion({
            ...draft,
            title: draft.title.trim(),
            description: draft.description.trim()
        });

        if (!goalToSave.title) return;

        try {
            if (editingGoal) {
                const response = await api.put(`/tasks/${editingGoal.id}`, goalToSave);

                setGoals((prev) =>
                    prev.map((goal) =>
                        goal.id === editingGoal.id ? normalizeGoal(response.data) : goal
                    )
                );
            } else {
                const response = await api.post("/tasks", goalToSave);

                setGoals((prev) => [
                    normalizeGoal(response.data),
                    ...prev
                ]);
            }

            closeEditor();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteGoal = async (goal) => {
        if (!window.confirm(`Delete "${goal.title}"?`)) return;

        try {
            await api.delete(`/tasks/${goal.id}`);
            setGoals((prev) => prev.filter((item) => item.id !== goal.id));
        } catch (error) {
            console.error(error);
        }
    };

    const updateGoal = async (goal) => {
        const syncedGoal = syncCompletion(goal);

        try {
            const response = await api.put(`/tasks/${goal.id}`, syncedGoal);

            setGoals((prev) =>
                prev.map((item) =>
                    item.id === goal.id ? normalizeGoal(response.data) : item
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const toggleGoal = (goal) => {
        const completed = !(goal.completed || goal.status === "completed");
        const nextGoal = {
            ...goal,
            completed,
            status: completed ? "completed" : "active",
            steps: (goal.steps || []).map((step) => ({
                ...step,
                done: completed
            }))
        };

        updateGoal(nextGoal);
    };

    const toggleStep = (goal, stepId) => {
        const nextGoal = {
            ...goal,
            steps: goal.steps.map((step) =>
                step.stepId === stepId
                    ? { ...step, done: !step.done }
                    : step
            )
        };

        updateGoal(nextGoal);
    };

    const addDraftStep = () => {
        const text = newStepText.trim();

        if (!text) return;

        setDraft((prev) => ({
            ...prev,
            steps: [
                ...prev.steps,
                {
                    stepId: createId(),
                    text,
                    done: false
                }
            ]
        }));
        setNewStepText("");
    };

    const removeDraftStep = (stepId) => {
        setDraft((prev) => ({
            ...prev,
            steps: prev.steps.filter((step) => step.stepId !== stepId)
        }));
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppHeader
                categoryView={categoryView}
                onToggleView={() => setCategoryView((value) => !value)}
                onCreate={() => openCreateModal()}
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
                        <EmptyJourney onCreate={() => openCreateModal()} />
                    ) : categoryView ? (
                        <Stack spacing={4}>
                            {CATEGORIES.map((category) => (
                                <CategorySection
                                    key={category.key}
                                    category={category}
                                    goals={goals.filter((goal) => goal.category === category.key)}
                                    onCreate={openCreateModal}
                                    onEdit={openEditModal}
                                    onDelete={deleteGoal}
                                    onToggleGoal={toggleGoal}
                                    onToggleStep={toggleStep}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <ListView
                            goals={filteredGoals}
                            query={query}
                            categoryFilter={categoryFilter}
                            statusFilter={statusFilter}
                            onQueryChange={setQuery}
                            onCategoryFilterChange={setCategoryFilter}
                            onStatusFilterChange={setStatusFilter}
                            onEdit={openEditModal}
                            onDelete={deleteGoal}
                            onToggleGoal={toggleGoal}
                        />
                    )}
                </Stack>
            </Container>

            <GoalEditor
                open={editorOpen}
                draft={draft}
                editingGoal={editingGoal}
                newStepText={newStepText}
                onClose={closeEditor}
                onSave={saveGoal}
                onDraftChange={setDraft}
                onNewStepTextChange={setNewStepText}
                onAddStep={addDraftStep}
                onRemoveStep={removeDraftStep}
            />
        </Box>
    );
}

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

function CategorySection({
    category,
    goals,
    onCreate,
    onEdit,
    onDelete,
    onToggleGoal,
    onToggleStep
}) {
    const activeGoals = goals.filter((goal) => goal.status !== "completed");
    const completedGoals = goals.filter((goal) => goal.status === "completed");
    const totalSteps = goals.reduce((sum, goal) => sum + (goal.steps?.length || 0), 0);
    const doneSteps = goals.reduce(
        (sum, goal) => sum + (goal.steps?.filter((step) => step.done).length || 0),
        0
    );
    const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

    return (
        <Box component="section">
            <Box
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    background: category.gradient,
                    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.12)"
                }}
            >
                <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 1,
                                bgcolor: "rgba(255,255,255,0.2)",
                                display: "grid",
                                placeItems: "center",
                                fontSize: 22
                            }}
                        >
                            <RoundedGoalIcon
                                iconKey={category.iconKey}
                                sx={{ color: "white", fontSize: 24 }}
                            />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontWeight: 800,
                                    color: "white",
                                    lineHeight: 1
                                }}
                            >
                                {category.label}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12, mt: 0.5 }}>
                                {category.sublabel}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: "white", fontWeight: 800, lineHeight: 1 }}>
                                {goals.length}
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12 }}>
                                goals
                            </Typography>
                        </Box>

                        {totalSteps > 0 && (
                            <Box sx={{ textAlign: "right" }}>
                                <Typography sx={{ color: "white", fontWeight: 800, lineHeight: 1 }}>
                                    {progress}%
                                </Typography>
                                <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: 12 }}>
                                    done
                                </Typography>
                            </Box>
                        )}

                        <Tooltip title={`Add ${category.label} goal`}>
                            <IconButton
                                onClick={() => onCreate(category.key)}
                                sx={{
                                    color: "white",
                                    bgcolor: "rgba(255,255,255,0.18)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" }
                                }}
                            >
                                <Add />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>

                {totalSteps > 0 && (
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            mt: 1.5,
                            height: 6,
                            borderRadius: 99,
                            bgcolor: "rgba(255,255,255,0.25)",
                            "& .MuiLinearProgress-bar": {
                                bgcolor: "rgba(255,255,255,0.85)"
                            }
                        }}
                    />
                )}
            </Box>

            {goals.length === 0 ? (
                <Paper
                    elevation={0}
                    onClick={() => onCreate(category.key)}
                    sx={{
                        p: 4,
                        borderRadius: 1,
                        border: `2px dashed ${category.border}`,
                        textAlign: "center",
                        cursor: "pointer",
                        color: "text.secondary",
                        transition: "background-color 160ms ease",
                        "&:hover": {
                            bgcolor: category.soft,
                            color: "text.primary"
                        }
                    }}
                >
                    <RoundedGoalIcon
                        iconKey={category.iconKey}
                        sx={{ color: category.text, fontSize: 36, mb: 1 }}
                    />
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                        No {category.label.toLowerCase()} goals yet. Click to add one!
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={1.5}>
                    {activeGoals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleGoal={onToggleGoal}
                            onToggleStep={onToggleStep}
                        />
                    ))}

                    {completedGoals.length > 0 && (
                        <>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ opacity: 0.65 }}>
                                <Divider sx={{ flex: 1, borderColor: category.border }} />
                                <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700 }}>
                                    Completed ({completedGoals.length})
                                </Typography>
                                <Divider sx={{ flex: 1, borderColor: category.border }} />
                            </Stack>

                            <Stack spacing={1.5} sx={{ opacity: 0.65 }}>
                                {completedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal.id}
                                        goal={goal}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleGoal={onToggleGoal}
                                        onToggleStep={onToggleStep}
                                    />
                                ))}
                            </Stack>
                        </>
                    )}
                </Stack>
            )}
        </Box>
    );
}

function GoalCard({ goal, onEdit, onDelete, onToggleGoal, onToggleStep }) {
    const [expanded, setExpanded] = useState(false);
    const category = getCategory(goal.category);
    const progress = getStepProgress(goal);
    const completed = goal.status === "completed" || goal.completed;
    const hasSteps = goal.steps?.length > 0;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 1,
                border: `2px solid ${category.border}`,
                bgcolor: category.soft,
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)"
            }}
        >
            <Box sx={{ height: 6, background: category.gradient }} />

            <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <IconButton onClick={() => onToggleGoal(goal)} sx={{ p: 0.25, mt: 0.25 }}>
                        {completed ? (
                            <CheckCircle sx={{ color: category.text }} />
                        ) : (
                            <RadioButtonUnchecked sx={{ color: "text.disabled" }} />
                        )}
                    </IconButton>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <RoundedGoalIcon
                                iconKey={goal.emoji}
                                fallbackKey={category.iconKey}
                                sx={{ color: category.text, fontSize: 24 }}
                            />
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: completed ? "text.secondary" : "text.primary",
                                    textDecoration: completed ? "line-through" : "none",
                                    opacity: completed ? 0.65 : 1,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {goal.title}
                            </Typography>
                        </Stack>

                        {goal.description && (
                            <Typography
                                sx={{
                                    mt: 0.5,
                                    color: "text.secondary",
                                    fontSize: 14,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}
                            >
                                {goal.description}
                            </Typography>
                        )}

                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
                            <Chip
                                size="small"
                                icon={(
                                    <RoundedGoalIcon
                                        iconKey={category.iconKey}
                                        sx={{ color: `${category.text} !important`, fontSize: "16px !important" }}
                                    />
                                )}
                                label={category.label}
                                sx={{
                                    bgcolor: category.badgeBg,
                                    color: category.text,
                                    fontWeight: 800
                                }}
                            />

                            {goal.targetDate && (
                                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                                    <CalendarToday sx={{ fontSize: 14 }} />
                                    <Typography sx={{ fontSize: 12 }}>
                                        {formatDate(goal.targetDate)}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.25} alignItems="center">
                        <Tooltip title="Edit goal">
                            <IconButton onClick={() => onEdit(goal)} size="small">
                                <Edit fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete goal">
                            <IconButton onClick={() => onDelete(goal)} size="small" color="error">
                                <Delete fontSize="small" />
                            </IconButton>
                        </Tooltip>

                        {hasSteps && (
                            <Tooltip title={expanded ? "Hide steps" : "Show steps"}>
                                <IconButton onClick={() => setExpanded((value) => !value)} size="small">
                                    {expanded ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Stack>

                {hasSteps && (
                    <Box sx={{ pl: { xs: 0, sm: 5 }, mt: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 700 }}>
                                {goal.steps.filter((step) => step.done).length}/{goal.steps.length} steps
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    flex: 1,
                                    height: 8,
                                    borderRadius: 99,
                                    bgcolor: "rgba(255,255,255,0.65)",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: category.progress
                                    }
                                }}
                            />
                        </Stack>

                        {expanded && (
                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                {goal.steps.map((step) => (
                                    <Button
                                        key={step.stepId}
                                        variant="text"
                                        onClick={() => onToggleStep(goal, step.stepId)}
                                        startIcon={step.done ? (
                                            <CheckCircle sx={{ color: category.text }} />
                                        ) : (
                                            <RadioButtonUnchecked />
                                        )}
                                        sx={{
                                            justifyContent: "flex-start",
                                            color: step.done ? "text.secondary" : "text.primary",
                                            textDecoration: step.done ? "line-through" : "none",
                                            textTransform: "none",
                                            px: 0,
                                            minHeight: 28
                                        }}
                                    >
                                        {step.text}
                                    </Button>
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
            </Box>
        </Paper>
    );
}

function ListView({
    goals,
    query,
    categoryFilter,
    statusFilter,
    onQueryChange,
    onCategoryFilterChange,
    onStatusFilterChange,
    onEdit,
    onDelete,
    onToggleGoal
}) {
    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search goals..."
                    fullWidth
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                />

                <Select
                    value={categoryFilter}
                    onChange={(event) => onCategoryFilterChange(event.target.value)}
                    size="small"
                    sx={{ minWidth: { sm: 160 } }}
                >
                    <MenuItem value="all">All Categories</MenuItem>
                    {CATEGORIES.map((category) => (
                        <MenuItem key={category.key} value={category.key}>
                            {category.label}
                        </MenuItem>
                    ))}
                </Select>

                <Select
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value)}
                    size="small"
                    sx={{ minWidth: { sm: 140 } }}
                >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                </Select>
            </Stack>

            {goals.length === 0 ? (
                <Paper elevation={0} sx={{ p: 5, textAlign: "center", borderRadius: 1 }}>
                    <Typography color="text.secondary">
                        No goals match your search.
                    </Typography>
                </Paper>
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        overflow: "hidden"
                    }}
                >
                    {goals.map((goal, index) => {
                        const category = getCategory(goal.category);
                        const completed = goal.status === "completed" || goal.completed;

                        return (
                            <Box key={goal.id}>
                                {index > 0 && <Divider />}
                                <Stack
                                    direction="row"
                                    spacing={1.25}
                                    alignItems="center"
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        "&:hover": { bgcolor: "rgba(244, 244, 245, 0.65)" }
                                    }}
                                >
                                    <IconButton onClick={() => onToggleGoal(goal)} size="small">
                                        {completed ? (
                                            <CheckCircle sx={{ color: category.text }} />
                                        ) : (
                                            <RadioButtonUnchecked sx={{ color: "text.disabled" }} />
                                        )}
                                    </IconButton>

                                    <RoundedGoalIcon
                                        iconKey={goal.emoji}
                                        fallbackKey={category.iconKey}
                                        sx={{ color: category.text, fontSize: 22 }}
                                    />

                                    <Typography
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            fontSize: 14,
                                            fontWeight: 700,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            color: completed ? "text.secondary" : "text.primary",
                                            textDecoration: completed ? "line-through" : "none"
                                        }}
                                    >
                                        {goal.title}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={category.label}
                                        sx={{
                                            display: { xs: "none", sm: "inline-flex" },
                                            bgcolor: category.badgeBg,
                                            color: category.text,
                                            fontWeight: 800
                                        }}
                                    />

                                    <Tooltip title="Edit goal">
                                        <IconButton onClick={() => onEdit(goal)} size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Delete goal">
                                        <IconButton onClick={() => onDelete(goal)} size="small" color="error">
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                        );
                    })}
                </Paper>
            )}
        </Stack>
    );
}

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

function GoalEditor({
    open,
    draft,
    editingGoal,
    newStepText,
    onClose,
    onSave,
    onDraftChange,
    onNewStepTextChange,
    onAddStep,
    onRemoveStep
}) {
    const category = getCategory(draft.category);
    const fieldSx = {
        "& .MuiOutlinedInput-root": {
            bgcolor: "#ffffff",
            transition: "border-color 160ms ease, box-shadow 160ms ease",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#d4d4d8",
                borderWidth: 1
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: category.progress
            },
            "&.Mui-focused": {
                boxShadow: `0 0 0 3px ${category.badgeBg}`
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: category.progress,
                borderWidth: 2
            }
        },
        "& .MuiInputBase-input::placeholder": {
            color: "#a1a1aa",
            fontWeight: 500,
            opacity: 1
        },
        "& .MuiInputLabel-root.Mui-focused": {
            color: category.text
        }
    };

    const updateDraft = (updates) => {
        onDraftChange((prev) => ({
            ...prev,
            ...updates
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <Box sx={{ height: 8, background: category.gradient }} />
            <DialogContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 22
                            }}
                        >
                            {editingGoal ? "Edit Goal" : "New Goal"}
                        </Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Stack>

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Choose an icon
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" gap={1}>
                            {ICON_OPTIONS.map((option) => {
                                const selected = getIconKey(draft.emoji, category.iconKey) === option.key;
                                const Icon = option.Icon;

                                return (
                                    <Tooltip key={option.key} title={option.label}>
                                        <IconButton
                                            onClick={() => updateDraft({ emoji: option.key })}
                                            sx={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 1,
                                                border: `2px solid ${selected ? category.progress : category.border}`,
                                                bgcolor: selected ? category.soft : "#ffffff",
                                                color: selected ? category.text : "text.secondary",
                                                boxShadow: selected ? "0 4px 12px rgba(15,23,42,0.12)" : "none",
                                                transition: "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
                                                "&:hover": {
                                                    bgcolor: category.badgeBg,
                                                    color: category.text,
                                                    transform: "translateY(-1px)",
                                                    boxShadow: "0 4px 12px rgba(15,23,42,0.1)"
                                                }
                                            }}
                                        >
                                            <Icon sx={{ fontSize: 22 }} />
                                        </IconButton>
                                    </Tooltip>
                                );
                            })}
                        </Stack>
                    </Box>

                    <TextField
                        label="Goal Title"
                        placeholder="Enter your goal title"
                        value={draft.title}
                        onChange={(event) => updateDraft({ title: event.target.value })}
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />

                    <TextField
                        label="Description"
                        placeholder="Add a short description"
                        value={draft.description}
                        onChange={(event) => updateDraft({ description: event.target.value })}
                        multiline
                        rows={2}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={fieldSx}
                    />

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Category
                        </Typography>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr" },
                                gap: 1
                            }}
                        >
                            {CATEGORIES.map((item) => {
                                const selected = draft.category === item.key;

                                return (
                                    <Button
                                        key={item.key}
                                        onClick={() => updateDraft({ category: item.key, emoji: draft.emoji || item.iconKey })}
                                        sx={{
                                            justifyContent: "flex-start",
                                            alignItems: "flex-start",
                                            p: 1.25,
                                            borderRadius: 1,
                                            border: `2px solid ${selected ? item.progress : "#e4e4e7"}`,
                                            bgcolor: selected ? item.soft : "white",
                                            color: selected ? item.text : "text.primary",
                                            textTransform: "none",
                                            minHeight: 78,
                                            boxShadow: selected ? "0 4px 12px rgba(15,23,42,0.08)" : "none",
                                            "&:hover": {
                                                bgcolor: item.soft,
                                                borderColor: item.progress
                                            }
                                        }}
                                    >
                                        <Stack alignItems="flex-start" spacing={0.25}>
                                            <RoundedGoalIcon
                                                iconKey={item.iconKey}
                                                sx={{ color: item.text, fontSize: 22 }}
                                            />
                                            <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
                                                {item.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: 11, color: "text.secondary", textAlign: "left" }}>
                                                {item.sublabel}
                                            </Typography>
                                        </Stack>
                                    </Button>
                                );
                            })}
                        </Box>
                    </Box>

                    <TextField
                        label="Target Date"
                        type="date"
                        value={draft.targetDate}
                        onChange={(event) => updateDraft({ targetDate: event.target.value })}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarToday sx={{ color: category.text, fontSize: 18 }} />
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            ...fieldSx,
                            "& input[type='date']::-webkit-calendar-picker-indicator": {
                                cursor: "pointer",
                                opacity: 0.75
                            }
                        }}
                    />

                    <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "text.secondary", mb: 1 }}>
                            Steps / Sub-tasks
                        </Typography>

                        <Stack spacing={1} sx={{ mb: 1 }}>
                            {draft.steps.map((step, index) => (
                                <Stack
                                    key={step.stepId}
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                        bgcolor: "secondary.main",
                                        borderRadius: 1,
                                        px: 1.5,
                                        py: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: "50%",
                                            bgcolor: category.progress,
                                            color: "white",
                                            display: "grid",
                                            placeItems: "center",
                                            fontSize: 12,
                                            fontWeight: 800
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Typography sx={{ flex: 1, fontSize: 14 }}>
                                        {step.text}
                                    </Typography>
                                    <IconButton onClick={() => onRemoveStep(step.stepId)} size="small" color="error">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Stack>
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={1}>
                            <TextField
                                value={newStepText}
                                onChange={(event) => onNewStepTextChange(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        onAddStep();
                                    }
                                }}
                                placeholder="Add a step or milestone"
                                size="small"
                                fullWidth
                                sx={fieldSx}
                            />
                            <Button
                                variant="contained"
                                onClick={onAddStep}
                                sx={{
                                    minWidth: 44,
                                    px: 1.25,
                                    bgcolor: category.progress,
                                    "&:hover": {
                                        bgcolor: category.text
                                    }
                                }}
                            >
                                <Add />
                            </Button>
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onClose}
                            sx={{
                                py: 1.25,
                                borderColor: "divider",
                                color: "text.secondary",
                                bgcolor: "#ffffff",
                                "&:hover": {
                                    borderColor: category.border,
                                    bgcolor: category.soft,
                                    color: category.text
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onSave}
                            disabled={!draft.title.trim()}
                            startIcon={<FlagRounded />}
                            sx={{
                                py: 1.25,
                                background: category.gradient,
                                color: "#ffffff",
                                boxShadow: "0 8px 18px rgba(15, 23, 42, 0.14)",
                                "&:hover": {
                                    boxShadow: "0 10px 22px rgba(15, 23, 42, 0.18)"
                                },
                                "&.Mui-disabled": {
                                    bgcolor: "#e4e4e7",
                                    background: "#e4e4e7",
                                    color: "#a1a1aa",
                                    boxShadow: "none"
                                }
                            }}
                        >
                            {editingGoal ? "Save Changes" : "Create Goal"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default Dashboard;
