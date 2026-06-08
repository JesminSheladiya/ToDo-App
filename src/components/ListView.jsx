import { Box, IconButton, InputAdornment, MenuItem, Select, TextField, Tooltip, Typography } from "@mui/material";
import { Search, CheckCircle, RadioButtonUnchecked, Edit, Delete, PauseCircle, PlayCircle } from "@mui/icons-material";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function ListView({ goals, categories, query, categoryFilter, statusFilter, onQueryChange, onCategoryFilterChange, onStatusFilterChange, onEdit, onDelete, onToggleGoal, onPauseToggle }) {
    const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat.key] = goals.filter((g) => g.category === cat.key).length;
        return acc;
    }, {});
    const statusCounts = {
        active: goals.filter((g) => g.status === "active" && !g.completed).length,
        completed: goals.filter((g) => g.completed || g.status === "completed").length,
        paused: goals.filter((g) => g.status === "paused").length,
    };
    return (
        <Stack spacing={2}>
            <Box sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
            }}>
                <TextField
                    size="small"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder="Search goals..."
                    sx={{
                        flex: { xs: "1 1 100%", sm: "1 1 auto" },
                        minWidth: { sm: 220 },
                        "& .MuiOutlinedInput-root": {
                            bgcolor: "#ffffff",
                            boxShadow: "0 1px 3px rgb(0 0 0 / .04)",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "hsl(240, 10%, 88%)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#7c3aed",
                            },
                            "&.Mui-focused": {
                                boxShadow: "0 0 0 3px hsl(262, 83%, 95%)",
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ fontSize: 18, color: "hsl(240, 8%, 50%)" }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Select
                    size="small"
                    value={categoryFilter}
                    onChange={(e) => onCategoryFilterChange(e.target.value)}
                    sx={{
                        flex: { xs: "1 1 calc(50% - 4px)", sm: "0 1 auto" },
                        minWidth: 140,
                        bgcolor: "#ffffff",
                        boxShadow: "0 1px 3px rgb(0 0 0 / .04)",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "hsl(240, 10%, 88%)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7c3aed",
                        },
                    }}
                >
                    <MenuItem value="all">All Categories ({goals.length})</MenuItem>
                    {categories.map((cat) => (
                        <MenuItem key={cat.key} value={cat.key}>{cat.label} ({categoryCounts[cat.key]})</MenuItem>
                    ))}
                </Select>
                <Select
                    size="small"
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    sx={{
                        flex: { xs: "1 1 calc(50% - 4px)", sm: "0 1 auto" },
                        minWidth: 130,
                        bgcolor: "#ffffff",
                        boxShadow: "0 1px 3px rgb(0 0 0 / .04)",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "hsl(240, 10%, 88%)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#7c3aed",
                        },
                    }}
                >
                    <MenuItem value="all">All Statuses ({goals.length})</MenuItem>
                    <MenuItem value="active">Active ({statusCounts.active})</MenuItem>
                    <MenuItem value="completed">Completed ({statusCounts.completed})</MenuItem>
                    <MenuItem value="paused">Paused ({statusCounts.paused})</MenuItem>
                </Select>
            </Box>

            {goals.length === 0 ? (
                <Box sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px dashed hsl(240, 10%, 85%)",
                    p: 5,
                    textAlign: "center",
                    animation: "fadeInUp 300ms ease-out forwards",
                }}>
                    <Typography sx={{
                        fontSize: 40,
                        mb: 1,
                        opacity: 0.7,
                    }}>
                        🔍
                    </Typography>
                    <Typography sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        No goals found
                    </Typography>
                    <Typography sx={{
                        fontSize: 13,
                        color: "hsl(240, 8%, 50%)",
                    }}>
                        Try adjusting your search or filters
                    </Typography>
                </Box>
            ) : (
                <Box sx={{
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    border: "1px solid hsl(240, 10%, 90%)",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgb(0 0 0 / .04)",
                    animation: "fadeInUp 300ms ease-out forwards",
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: "linear-gradient(180deg, hsl(var(--short-term)), hsl(var(--long-term)), hsl(var(--life-goal)))",
                        borderRadius: "16px 0 0 16px",
                    },
                }}>
                    {goals.map((goal, index) => {
                        const category = categories.find((c) => c.key === goal.category) || categories[0];
                        const completed = goal.status === "completed" || goal.completed;
                        const paused = goal.status === "paused";

                        return (
                            <Box
                                key={goal.id}
                                sx={{
                                    transition: "background-color 150ms ease",
                                    bgcolor: paused ? "hsl(39, 90%, 97%)" : "transparent",
                                    "&:hover": {
                                        bgcolor: paused ? "hsl(39, 90%, 95%)" : "hsl(240, 20%, 98%)",
                                    },
                                    borderBottom: index < goals.length - 1 ? "1px solid hsl(240, 10%, 93%)" : "none",
                                }}
                            >
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: { xs: 2, sm: 2.5 },
                                    py: 1.25,
                                    minHeight: 52,
                                }}>
                                    <IconButton
                                        onClick={() => onToggleGoal(goal)}
                                        size="small"
                                        sx={{
                                            p: 0.25,
                                            color: completed ? category.text : "hsl(240, 6%, 70%)",
                                            transition: "all 150ms ease",
                                            "&:hover": { transform: "scale(1.1)" },
                                        }}
                                    >
                                        {completed ? (
                                            <CheckCircle sx={{ fontSize: 22 }} />
                                        ) : (
                                            <RadioButtonUnchecked sx={{ fontSize: 22 }} />
                                        )}
                                    </IconButton>

                                    <RoundedGoalIcon
                                        iconKey={goal.emoji}
                                        fallbackKey={category.iconKey}
                                        sx={{ color: category.text, fontSize: 18, flexShrink: 0 }}
                                    />

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                color: completed ? "hsl(240, 8%, 50%)" : paused ? "hsl(39, 90%, 40%)" : "hsl(240, 15%, 10%)",
                                                textDecoration: completed ? "line-through" : "none",
                                                opacity: completed ? 0.6 : paused ? 0.75 : 1,
                                                fontStyle: paused ? "italic" : "normal",
                                            }}
                                        >
                                            {goal.title}
                                        </Typography>
                                        {paused && (
                                            <Typography sx={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: "hsl(39, 90%, 45%)",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 0.25,
                                            }}>
                                                <PauseCircle sx={{ fontSize: 13 }} /> Paused
                                            </Typography>
                                        )}
                                    </Box>

                                    {category && (
                                        <Box sx={{
                                            px: 1.25,
                                            py: 0.375,
                                            borderRadius: "8px",
                                            background: category.gradient,
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: 11,
                                            display: { xs: "none", sm: "inline-flex" },
                                            whiteSpace: "nowrap",
                                        }}>
                                            {category.label}
                                        </Box>
                                    )}

                                    <Tooltip title={paused ? "Resume" : "Pause"} arrow>
                                        <IconButton
                                            onClick={() => onPauseToggle(goal)}
                                            size="small"
                                            sx={{
                                                p: 0.5,
                                                color: paused ? "hsl(39, 90%, 45%)" : "hsl(240, 8%, 50%)",
                                                "&:hover": {
                                                    color: paused ? "#d97706" : "#7c3aed",
                                                    bgcolor: paused ? "hsl(39, 90%, 92%)" : "hsl(262, 83%, 96%)",
                                                },
                                            }}
                                        >
                                            {paused ? <PlayCircle sx={{ fontSize: 17 }} /> : <PauseCircle sx={{ fontSize: 17 }} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={() => onEdit(goal)}
                                            size="small"
                                            sx={{
                                                p: 0.5,
                                                color: "hsl(240, 8%, 50%)",
                                                "&:hover": {
                                                    color: "#7c3aed",
                                                    bgcolor: "hsl(262, 83%, 96%)",
                                                },
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            onClick={() => onDelete(goal)}
                                            size="small"
                                            sx={{
                                                p: 0.5,
                                                color: "hsl(240, 8%, 60%)",
                                                "&:hover": {
                                                    color: "#dc2626",
                                                    bgcolor: "hsl(0, 84%, 95%)",
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 17 }} />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Stack>
    );
}

export default ListView;
