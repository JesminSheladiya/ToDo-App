import { useRef, useState } from "react";
import { Box, ClickAwayListener, IconButton, InputAdornment, Popper, TextField, Tooltip, Typography } from "@mui/material";
import { Search, CheckCircle, RadioButtonUnchecked, Edit, Delete, PauseCircleOutlineRounded, PlayCircleOutlineRounded, ExpandMore, MoreVert } from "@mui/icons-material";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

function Dropdown({ trigger, options }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box ref={anchorRef} sx={{ position: "relative" }}>
                <Box onClick={() => setOpen((v) => !v)} sx={{ cursor: "pointer" }}>
                    {trigger}
                </Box>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current?.firstChild || anchorRef.current}
                    placement="bottom-start"
                    sx={{ zIndex: 1400 }}
                >
                    <Box sx={{
                        mt: 0.5,
                        bgcolor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px solid hsl(240, 10%, 90%)",
                        boxShadow: "0 4px 16px rgb(0 0 0 / .1)",
                        minWidth: anchorRef.current?.offsetWidth || 140,
                        overflow: "hidden",
                    }}>
                        {options.map((opt, i) => (
                            <Box
                                key={opt.value}
                                onClick={() => { opt.onClick(); setOpen(false); }}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: opt.color || "hsl(240, 15%, 10%)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    borderBottom: i < options.length - 1 ? "1px solid hsl(240, 10%, 93%)" : "none",
                                    "&:hover": { bgcolor: opt.hoverBg || "hsl(240, 20%, 97%)" },
                                }}
                            >
                                {opt.icon}
                                {opt.label}
                            </Box>
                        ))}
                    </Box>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}

function SelectDropdown({ value, options, onChange, sx }) {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const selected = options.find((o) => o.value === value);

    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box ref={anchorRef} sx={{ position: "relative", ...sx }}>
                <Box
                    onClick={() => setOpen((v) => !v)}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.5,
                        py: 0.625,
                        borderRadius: "12px",
                        bgcolor: "#ffffff",
                        border: "1px solid hsl(240, 10%, 88%)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "hsl(240, 15%, 10%)",
                        minHeight: 36,
                        minWidth: 130,
                        "&:hover": { borderColor: "#7c3aed" },
                    }}
                >
                    <Box sx={{ flex: 1 }}>{selected?.label || value}</Box>
                    <ExpandMore sx={{ fontSize: 18, color: "hsl(240, 8%, 55%)" }} />
                </Box>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    sx={{ zIndex: 1400 }}
                >
                    <Box sx={{
                        mt: 0.5,
                        bgcolor: "#ffffff",
                        borderRadius: "10px",
                        border: "1px solid hsl(240, 10%, 90%)",
                        boxShadow: "0 4px 16px rgb(0 0 0 / .1)",
                        minWidth: anchorRef.current?.offsetWidth || 140,
                        overflow: "hidden",
                    }}>
                        {options.map((opt, i) => (
                            <Box
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    fontSize: 13,
                                    fontWeight: opt.value === value ? 700 : 500,
                                    color: opt.value === value ? "#7c3aed" : "hsl(240, 15%, 10%)",
                                    cursor: "pointer",
                                    borderBottom: i < options.length - 1 ? "1px solid hsl(240, 10%, 93%)" : "none",
                                    "&:hover": { bgcolor: "hsl(240, 20%, 97%)" },
                                }}
                            >
                                {opt.label}
                            </Box>
                        ))}
                    </Box>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}

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
                <SelectDropdown
                    value={categoryFilter}
                    options={[
                        { value: "all", label: `All Categories (${goals.length})` },
                        ...categories.map((cat) => ({ value: cat.key, label: `${cat.label} (${categoryCounts[cat.key]})` })),
                    ]}
                    onChange={onCategoryFilterChange}
                    sx={{ flex: { xs: "1 1 calc(50% - 4px)", sm: "0 1 auto" } }}
                />
                <SelectDropdown
                    value={statusFilter}
                    options={[
                        { value: "all", label: `All Statuses (${goals.length})` },
                        { value: "active", label: `Active (${statusCounts.active})` },
                        { value: "completed", label: `Completed (${statusCounts.completed})` },
                        { value: "paused", label: `Paused (${statusCounts.paused})` },
                    ]}
                    onChange={onStatusFilterChange}
                    sx={{ flex: { xs: "1 1 calc(50% - 4px)", sm: "0 1 auto" } }}
                />
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
                                            display: { xs: "none", sm: "inline-flex" },
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
                                                gap: 0.50,
                                                mt: 0.25,
                                            }}>
                                                <PauseCircleOutlineRounded sx={{ fontSize: 14 }} /> Paused
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
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.5,
                                                color: paused ? "hsl(39, 90%, 45%)" : "hsl(240, 8%, 50%)",
                                                "&:hover": {
                                                    color: paused ? "#d97706" : "#7c3aed",
                                                    bgcolor: paused ? "hsl(39, 90%, 92%)" : "hsl(262, 83%, 96%)",
                                                },
                                            }}
                                        >
                                            {paused ? <PlayCircleOutlineRounded sx={{ fontSize: 22 }} /> : <PauseCircleOutlineRounded sx={{ fontSize: 22 }} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={() => onEdit(goal)}
                                            size="small"
                                            sx={{
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.5,
                                                color: "hsl(240, 8%, 50%)",
                                                "&:hover": {
                                                    color: "#7c3aed",
                                                    bgcolor: "hsl(262, 83%, 96%)",
                                                },
                                            }}
                                        >
                                            <Edit sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            onClick={() => onDelete(goal)}
                                            size="small"
                                            sx={{
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.5,
                                                color: "hsl(240, 8%, 60%)",
                                                "&:hover": {
                                                    color: "#dc2626",
                                                    bgcolor: "hsl(0, 84%, 95%)",
                                                },
                                            }}
                                        >
                                            <Delete sx={{ fontSize: 20 }} />
                                        </IconButton>
                                    </Tooltip>

                                    <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                                        <Dropdown
                                            trigger={
                                                <IconButton size="small" sx={{ p: 0.5, color: "hsl(240, 8%, 50%)" }}>
                                                    <MoreVert sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            }
                                            options={[
                                                {
                                                    value: "toggle",
                                                    label: (goal.status === "completed" || goal.completed) ? "Mark Incomplete" : "Mark Complete",
                                                    icon: (goal.status === "completed" || goal.completed)
                                                        ? <CheckCircle sx={{ fontSize: 20, color: (categories.find(c => c.key === goal.category) || categories[0]).text }} />
                                                        : <RadioButtonUnchecked sx={{ fontSize: 20, color: "hsl(240, 10%, 75%)" }} />,
                                                    onClick: () => onToggleGoal(goal),
                                                },
                                                {
                                                    value: "pause",
                                                    label: goal.status === "paused" ? "Resume" : "Pause",
                                                    icon: goal.status === "paused"
                                                        ? <PlayCircleOutlineRounded sx={{ fontSize: 20, color: "hsl(39, 90%, 45%)" }} />
                                                        : <PauseCircleOutlineRounded sx={{ fontSize: 20, color: "hsl(240, 8%, 55%)" }} />,
                                                    onClick: () => onPauseToggle(goal),
                                                },
                                                {
                                                    value: "edit",
                                                    label: "Edit",
                                                    icon: <Edit sx={{ fontSize: 20, color: "hsl(240, 8%, 55%)" }} />,
                                                    onClick: () => onEdit(goal),
                                                },
                                                {
                                                    value: "delete",
                                                    label: "Delete",
                                                    icon: <Delete sx={{ fontSize: 20, color: "#dc2626" }} />,
                                                    onClick: () => onDelete(goal),
                                                    color: "#dc2626",
                                                    hoverBg: "hsl(0, 100%, 98%)",
                                                },
                                            ]}
                                        />
                                    </Box>
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
