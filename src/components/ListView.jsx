import { useRef, useState } from "react";
import { Box, ClickAwayListener, IconButton, InputAdornment, Popper, TextField, Tooltip, Typography } from "@mui/material";
import { PiMagnifyingGlassBold, PiDotsThreeVerticalBold } from "react-icons/pi";
import { FaRegCircle, FaCircleCheck } from "react-icons/fa6";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { IoChevronDownOutline } from "react-icons/io5";
import { TbPencil } from "react-icons/tb";
import { FiTrash } from "react-icons/fi";
import RoundedGoalIcon from "./RoundedGoalIcon";
import Stack from "./Stack";

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
                        borderRadius: "8px",
                        bgcolor: "#ffffff",
                        border: "1px solid hsl(240, 10%, 88%)",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "hsl(240, 15%, 10%)",
                        minHeight: 40,
                        minWidth: 130,
                        "&:hover": { borderColor: "#7c3aed" },
                    }}
                >
                    <Box sx={{ flex: 1 }}>{selected?.label || value}</Box>
                    <IoChevronDownOutline size={14} />
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

function ListView({ goals, allGoals = [], categories, query, categoryFilter, statusFilter, onQueryChange, onCategoryFilterChange, onStatusFilterChange, onEdit, onDelete, onToggleGoal, onPauseToggle }) {
    const [mobileMenuGoal, setMobileMenuGoal] = useState(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

    const goalsWithoutCategory = allGoals.filter((g) => {
        const matchesQuery = g.title.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === "all" || g.status === statusFilter;
        return matchesQuery && matchesStatus;
    });
    const goalsWithoutStatus = allGoals.filter((g) => {
        const matchesQuery = g.title.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter === "all" || g.category === categoryFilter;
        return matchesQuery && matchesCategory;
    });
    const categoryCounts = categories.reduce((acc, cat) => {
        acc[cat.key] = goalsWithoutCategory.filter((g) => g.category === cat.key).length;
        return acc;
    }, {});
    const statusCounts = {
        active: goalsWithoutStatus.filter((g) => g.status === "active" && !g.completed).length,
        completed: goalsWithoutStatus.filter((g) => g.completed || g.status === "completed").length,
        paused: goalsWithoutStatus.filter((g) => g.status === "paused").length,
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
                            borderRadius: "8px",
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
                                <PiMagnifyingGlassBold sx={{ fontSize: 18, color: "hsl(240, 8%, 50%)" }} />
                            </InputAdornment>
                        )
                    }}
                />
                <SelectDropdown
                    value={categoryFilter}
                    options={[
                        { value: "all", label: `All Categories (${goalsWithoutCategory.length})` },
                        ...categories.map((cat) => ({ value: cat.key, label: `${cat.label} (${categoryCounts[cat.key]})` })),
                    ]}
                    onChange={onCategoryFilterChange}
                    sx={{ flex: { xs: "1 1 calc(50% - 4px)", sm: "0 1 auto" } }}
                />
                <SelectDropdown
                    value={statusFilter}
                    options={[
                        { value: "all", label: `All Statuses (${goalsWithoutStatus.length})` },
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
                        <PiMagnifyingGlassBold sx={{ fontSize: 24, color: "hsl(240, 8%, 50%)" }} />
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
                                    gap: 0.75,
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
                                            color: completed ? category.text : "hsl(240, 8%, 50%)",
                                            opacity: paused ? 0.35 : 1,
                                            cursor: paused ? "not-allowed" : "pointer",
                                            transition: "all 150ms ease",
                                            "&:hover": { transform: paused ? "none" : "scale(1.1)" },
                                            "&:active": { transform: paused ? "none" : "scale(0.95)" },
                                        }}
                                    >
                                        {completed ? (
                                            <FaCircleCheck size={16} />
                                        ) : (
                                            <FaRegCircle size={16} />
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
                                                <BsFillPauseFill size={14} /> Paused
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

                                    <Tooltip title={completed ? "Cannot pause completed" : paused ? "Resume" : "Pause"} arrow>
                                        <IconButton
                                            onClick={() => onPauseToggle(goal)}
                                            size="small"
                                            sx={{
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.6,
                                                bgcolor: "hsl(240, 20%, 97%)",
                                                color: paused ? "hsl(39, 90%, 45%)" : "#d97706",
                                                opacity: completed ? 0.35 : 1,
                                                cursor: completed ? "not-allowed" : "pointer",
                                                "&:hover": {
                                                    bgcolor: completed ? "hsl(240, 20%, 97%)" : "hsl(39, 90%, 95%)"
                                                },
                                            }}
                                        >
                                            {paused ? <BsFillPlayFill size={18} /> : <BsFillPauseFill size={18} />}
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Edit" arrow>
                                        <IconButton
                                            onClick={() => onEdit(goal)}
                                            size="small"
                                            sx={{
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.6,
                                                bgcolor: "hsl(240, 20%, 97%)",
                                                color: "#7c3aed",
                                                "&:hover": {
                                                    color: "#7c3aed",
                                                    bgcolor: "hsl(262, 83%, 96%)",
                                                },
                                            }}
                                        >
                                            <TbPencil size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete" arrow>
                                        <IconButton
                                            onClick={() => onDelete(goal)}
                                            size="small"
                                            sx={{
                                                display: { xs: "none", sm: "inline-flex" },
                                                p: 0.6,
                                                bgcolor: "hsl(240, 20%, 97%)",
                                                color: "#dc2626",
                                                "&:hover": {
                                                    color: "#dc2626",
                                                    bgcolor: "hsl(0, 84%, 96%)",
                                                },
                                            }}
                                        >
                                            <FiTrash size={18} />
                                        </IconButton>
                                    </Tooltip>

                                    <Box sx={{ display: { xs: "inline-flex", sm: "none" } }}>
                                        <IconButton
                                            onClick={(e) => { setMobileMenuAnchor(e.currentTarget); setMobileMenuGoal(goal.id); }}
                                            size="small"
                                            sx={{ p: 0.6, bgcolor: "hsl(240, 20%, 97%)", color: "hsl(240, 8%, 50%)" }}
                                        >
                                            <PiDotsThreeVerticalBold size={20} />
                                        </IconButton>
                                        <Popper
                                            open={mobileMenuGoal === goal.id}
                                            anchorEl={mobileMenuAnchor}
                                            placement="bottom-end"
                                            sx={{ zIndex: 1400 }}
                                        >
                                            <ClickAwayListener onClickAway={() => { setMobileMenuGoal(null); setMobileMenuAnchor(null); }}>
                                                <Box sx={{
                                                    mt: 0.5,
                                                    bgcolor: "#fff",
                                                    borderRadius: "10px",
                                                    border: "1px solid hsl(240, 10%, 90%)",
                                                    boxShadow: "0 4px 16px rgb(0 0 0 / 10%)",
                                                    minWidth: 140,
                                                    overflow: "hidden",
                                                }}>
                                                    <Box
                                                        onClick={() => { if (goal.status !== "paused") { onToggleGoal(goal); setMobileMenuGoal(null); setMobileMenuAnchor(null); } }}
                                                        sx={{
                                                            px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
                                                            color: "hsl(240, 8%, 20%)",
                                                            cursor: goal.status === "paused" ? "not-allowed" : "pointer",
                                                            opacity: goal.status === "paused" ? 0.35 : 1,
                                                            display: "flex", alignItems: "center", gap: 1.5,
                                                            borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                            transition: "0.3s all ease",
                                                            "&:hover": {
                                                                bgcolor: goal.status === "paused" ? "inherit" : category.soft,
                                                                color: goal.status === "paused" ? "inherit" : category.text,
                                                            },
                                                        }}
                                                    >
                                                        {(goal.status === "completed" || goal.completed)
                                                            ? <FaCircleCheck size={16} color={category.text} />
                                                            : <FaRegCircle size={16} color={category.text} />
                                                        }
                                                        {(goal.status === "completed" || goal.completed) ? "Incomplete" : "Complete"}
                                                    </Box>
                                                    <Box
                                                        onClick={() => { if (!(goal.completed || goal.status === "completed")) { onPauseToggle(goal); setMobileMenuGoal(null); setMobileMenuAnchor(null); } }}
                                                        sx={{
                                                            px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
                                                            color: "hsl(240, 8%, 20%)",
                                                            cursor: (goal.status === "completed" || goal.completed) ? "not-allowed" : "pointer",
                                                            opacity: (goal.status === "completed" || goal.completed) ? 0.35 : 1,
                                                            display: "flex", alignItems: "center", gap: 1.5,
                                                            borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                            transition: "0.3s all ease",
                                                            "&:hover": {
                                                                bgcolor: (goal.status === "completed" || goal.completed) ? "inherit" : "hsla(38, 100%, 95%, 1)",
                                                                color: (goal.status === "completed" || goal.completed) ? "inherit" : "hsl(39, 90%, 45%)",
                                                            },
                                                        }}
                                                    >
                                                        {goal.status === "paused"
                                                            ? <BsFillPlayFill size={18} color="hsl(39, 90%, 45%)" />
                                                            : <BsFillPauseFill size={18} color="#d97706" />
                                                        }
                                                        {goal.status === "paused" ? "Resume" : "Pause"}
                                                    </Box>
                                                    <Box
                                                        onClick={() => { onEdit(goal); setMobileMenuGoal(null); setMobileMenuAnchor(null); }}
                                                        sx={{
                                                            px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
                                                            color: "hsl(240, 8%, 20%)",
                                                            cursor: "pointer", display: "flex", alignItems: "center", gap: 1.5,
                                                            borderBottom: "1px solid hsl(240, 10%, 93%)",
                                                            transition: "0.3s all ease",
                                                            "&:hover": {
                                                                bgcolor: "hsl(240, 100%, 98%)",
                                                                color: "#7c3aed",
                                                            },
                                                        }}
                                                    >
                                                        <TbPencil size={18} color="#7c3aed" />
                                                        Edit
                                                    </Box>
                                                    <Box
                                                        onClick={() => { onDelete(goal); setMobileMenuGoal(null); setMobileMenuAnchor(null); }}
                                                        sx={{
                                                            px: 1.5, py: 1, fontSize: 13, fontWeight: 500,
                                                            color: "hsl(240, 8%, 20%)",
                                                            cursor: "pointer", display: "flex", alignItems: "center", gap: 1.5,
                                                            transition: "0.3s all ease",
                                                            "&:hover": {
                                                                bgcolor: "hsl(0, 100%, 98%)",
                                                                color: "#dc2626",
                                                            },
                                                        }}
                                                    >
                                                        <FiTrash size={16} color="#dc2626" />
                                                        Delete
                                                    </Box>
                                                </Box>
                                            </ClickAwayListener>
                                        </Popper>
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
