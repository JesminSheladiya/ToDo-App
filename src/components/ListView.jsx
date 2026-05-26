import { CheckCircle, Delete, Edit, RadioButtonUnchecked, Search } from "@mui/icons-material";
import {
    Box, Chip, Divider, IconButton, InputAdornment, MenuItem,
    Paper, Select, TextField, Tooltip, Typography
} from "@mui/material";
import { CATEGORIES } from "../constants/goals";
import { getCategory } from "../utils/goals";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

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

export default ListView;
