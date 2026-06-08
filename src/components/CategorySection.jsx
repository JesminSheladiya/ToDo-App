import { useCallback, useMemo, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Add, ExpandMore, FiberManualRecord } from "@mui/icons-material";
import { Box, Button, Collapse, IconButton, LinearProgress, Typography } from "@mui/material";
import SortableGoalRow from "./SortableGoalRow";
import RoundedGoalIcon from "./RoundedGoalIcon";

function CategorySection({ category, goals, onCreate, onEdit, onDelete, onToggleGoal, onToggleStep, onPauseToggle, onReorderGoals, onReorderSteps }) {
    const [expanded, setExpanded] = useState(true);
    const stats = useMemo(() => {
        const total = goals.length;
        const completed = goals.filter((g) => g.completed || g.status === "completed").length;
        const totalSteps = goals.reduce((s, g) => s + (g.steps?.length || 0), 0);
        const doneSteps = goals.reduce((s, g) => s + (g.steps?.filter((st) => st.done).length || 0), 0);
        return {
            total,
            completed,
            totalSteps,
            doneSteps,
            stepProgress: totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0
        };
    }, [goals]);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: { distance: 5 },
    });
    const sensors = useSensors(pointerSensor);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (!over || !onReorderGoals || active.id === over.id) return;

        const goalIds = goals.map((g) => String(g.id));
        const oldIndex = goalIds.indexOf(active.id);
        const newIndex = goalIds.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return;

        const newIds = [...goalIds];
        newIds.splice(newIndex, 0, newIds.splice(oldIndex, 1)[0]);
        onReorderGoals(category.key, newIds);
    }, [goals, onReorderGoals, category.key]);

    return (
        <Box
            sx={{
                bgcolor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid hsl(240, 10%, 90%)",
                overflow: "hidden",
                boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
                transition: "box-shadow 150ms ease, border-color 150ms ease",
                "&:hover": {
                    boxShadow: "0 1px 3px rgb(0 0 0 / .08), 0 1px 2px rgb(0 0 0 / .04)",
                },
            }}
        >
            <Box sx={{
                height: 3,
                background: category.gradient,
            }} />

            <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    py: 1.5,
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "background-color 150ms ease",
                    "&:hover": {
                        bgcolor: "hsl(240, 20%, 98%)",
                    },
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        backgroundColor: category.soft,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                    }}
                >
                    <RoundedGoalIcon iconKey={category.iconKey} sx={{ color: category.text, fontSize: 20 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'Sora', sans-serif",
                        color: "hsl(240, 15%, 10%)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                    }}>
                        {category.label}
                    </Typography>
                    <Typography sx={{
                        fontSize: 13,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                        lineHeight: 1.3,
                    }}>
                        {category.sublabel}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {stats.total > 0 && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 100 }}>
                            <Box sx={{ flex: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats.stepProgress}
                                    sx={{
                                        height: 6,
                                        borderRadius: 99,
                                        bgcolor: "hsl(240, 10%, 94%)",
                                        "& .MuiLinearProgress-bar": {
                                            borderRadius: 99,
                                            bgcolor: category.progress,
                                            transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                                        }
                                    }}
                                />
                            </Box>
                            <Typography sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "hsl(240, 8%, 50%)",
                                minWidth: 28,
                                textAlign: "right",
                            }}>
                                {stats.stepProgress}%
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: category.soft,
                            border: `1px solid ${category.border}`,
                        }}
                    >
                        <FiberManualRecord sx={{ fontSize: 8, color: category.text }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: category.text }}>
                            {stats.completed}/{stats.total}
                        </Typography>
                    </Box>

                    {goals.length > 0 && (
                        <IconButton
                            size="small"
                            sx={{
                                color: "hsl(240, 8%, 50%)",
                                transition: "transform 200ms ease",
                                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                        >
                            <ExpandMore sx={{ fontSize: 20 }} />
                        </IconButton>
                    )}
                </Box>
            </Box>

            <Collapse in={expanded} timeout={200}>
                {goals.length > 0 && (
                    <Box sx={{ borderTop: "1px solid hsl(240, 10%, 90%)" }}>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={goals.map((g) => String(g.id))}
                                strategy={verticalListSortingStrategy}
                            >
                                {goals.map((goal, index) => (
                                    <SortableGoalRow
                                        key={goal.id}
                                        goal={goal}
                                        category={category}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        onToggleGoal={onToggleGoal}
                                        onToggleStep={onToggleStep}
                                        onPauseToggle={onPauseToggle}
                                        onReorderSteps={onReorderSteps}
                                        isLast={index === goals.length - 1}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </Box>
                )}
            </Collapse>

            <Box sx={{
                px: { xs: 2, sm: 2.5 },
                py: 1,
                borderTop: "1px solid hsl(240, 10%, 90%)",
                bgcolor: "hsl(240, 20%, 99%)",
            }}>
                <Button
                    variant="text"
                    size="small"
                    onClick={() => onCreate(category.key)}
                    startIcon={<Add sx={{ fontSize: 18 }} />}
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: category.text,
                        borderRadius: "8px",
                        px: 1.5,
                        py: 0.5,
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: category.soft,
                        },
                    }}
                >
                    Add goal
                </Button>
            </Box>
        </Box>
    );
}

export default CategorySection;
