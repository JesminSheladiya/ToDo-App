import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Box, Button, CircularProgress, Drawer, IconButton,
    List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PiListBold, PiPlusBold } from "react-icons/pi";
import { FaListUl } from "react-icons/fa6";
import { RiDashboardFill } from "react-icons/ri";
import { fetchGoals } from "../store/goalsSlice";
import { setActiveCategory, clearActiveCategory } from "../store/uiSlice";
import ProgressSummary from "../components/ProgressSummary";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";
import RoundedGoalIcon from "../components/RoundedGoalIcon";

const SIDEBAR_WIDTH = 260;

function Sidebar({ categories, onClose, onCreate }) {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const activeCategory = useSelector((state) => state.ui.activeCategory);

    const isDashboard = location.pathname === "/";
    const isList = location.pathname === "/list";
    const isOnMainLayout = isDashboard || isList;

    const handleDashboardClick = () => {
        dispatch(clearActiveCategory());
        navigate("/");
        onClose?.();
    };

    const handleListClick = () => {
        dispatch(clearActiveCategory());
        navigate("/list");
        onClose?.();
    };

    const handleCategoryClick = (catKey) => {
        dispatch(setActiveCategory(catKey));
        if (location.pathname !== "/") {
            navigate("/");
        }
        onClose?.();
    };

    return (
        <Box className="sidebar"
            sx={{
                width: SIDEBAR_WIDTH,
                height: "100dvh",
                position: "sticky",
                top: 0,
                display: "flex",
                flexDirection: "column",
                bgcolor: "hsl(0, 0%, 100%)",
                borderRight: "1px solid hsl(240, 10%, 90%)",
                flexShrink: 0,
                overflow: "hidden",
            }}
        >
            <Box className="sidebar__logo" sx={{ px: 2.5, py: 2.5, pb: 1.5 }}>
                    <Stack className="sidebar__brand" direction="row" spacing={1.25} alignItems="center">
                    <Box className="sidebar__brand-icon"
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            fontSize: 17,
                            fontWeight: 800,
                            fontFamily: "'Sora', sans-serif",
                            flexShrink: 0,
                            boxShadow: "0 2px 8px rgb(124, 58, 237 / .3)",
                        }}
                    >
                        GT
                    </Box>
                    <Box className="sidebar__brand-text">
                        <Typography className="sidebar__brand-title"
                            sx={{
                                fontFamily: "'Sora', sans-serif",
                                fontWeight: 800,
                                fontSize: 18,
                                color: "hsl(240, 15%, 10%)",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                            }}
                        >
                            Goal ToDo
                        </Typography>
                        <Typography className="sidebar__brand-subtitle"
                            sx={{
                                fontSize: 11,
                                color: "hsl(240, 8%, 50%)",
                                fontWeight: 500,
                                lineHeight: 1.2,
                            }}
                        >
                            Track your journey
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Box className="sidebar__divider" sx={{ mx: 2, height: "1px", bgcolor: "hsl(240, 10%, 90%)" }} />

            <List className="sidebar__nav" sx={{ px: 1.5, pt: 1.5, pb: 1, flex: 1, overflowY: "auto" }}>
                <ListItemButton className="sidebar__nav-item"
                    selected={isDashboard && isOnMainLayout && activeCategory === "all"}
                    onClick={handleDashboardClick}
                    sx={{
                        borderRadius: "10px",
                        mb: 0.5,
                        px: 1.5,
                        py: 1,
                        position: "relative",
                        "&.Mui-selected": {
                            bgcolor: "hsl(262, 83%, 96%)",
                            "&:hover": { bgcolor: "hsl(262, 83%, 93%)" },
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 3,
                                height: 25,
                                borderRadius: "0 4px 4px 0",
                                background: "linear-gradient(180deg, #7c3aed, #a855f7)",
                            },
                        },
                        "&:hover": {
                            bgcolor: "hsl(262, 83%, 97%)",
                        },
                    }}
                >
                    <ListItemIcon className="sidebar__nav-icon" sx={{ minWidth: 34, color: (isDashboard && isOnMainLayout && activeCategory === "all") ? "#7c3aed" : "hsl(240, 8%, 50%)" }}>
                        <RiDashboardFill sx={{
                            fontSize: 20,

                            transition: "color 150ms ease",
                        }} />
                    </ListItemIcon>
                    <ListItemText className="sidebar__nav-text"
                        primary="Dashboard"
                        slotProps={{
                            primary: {
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: (isDashboard && isOnMainLayout && activeCategory === "all") ? "#7c3aed" : "hsl(240, 15%, 10%)",
                                transition: "color 150ms ease",
                            }
                        }}
                    />
                </ListItemButton>

                <ListItemButton className="sidebar__nav-item"
                    selected={isList}
                    onClick={handleListClick}
                    sx={{
                        borderRadius: "10px",
                        mb: 0.5,
                        px: 1.5,
                        py: 1,
                        position: "relative",
                        "&.Mui-selected": {
                            bgcolor: "hsl(262, 83%, 96%)",
                            "&:hover": { bgcolor: "hsl(262, 83%, 93%)" },
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                width: 3,
                                height: 25,
                                borderRadius: "0 4px 4px 0",
                                background: "linear-gradient(180deg, #7c3aed, #a855f7)",
                            },
                        },
                        "&:hover": {
                            bgcolor: "hsl(262, 83%, 97%)",
                        },
                    }}
                >
                    <ListItemIcon className="sidebar__nav-icon" sx={{
                        minWidth: 34,
                        color: isList ? "#7c3aed" : "hsl(240, 8%, 50%)",
                    }}>
                        <FaListUl sx={{
                            fontSize: 20,
                            transition: "color 150ms ease",
                        }} />
                    </ListItemIcon>
                    <ListItemText className="sidebar__nav-text"
                        primary="All Goals"
                        slotProps={{
                            primary: {
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: isList ? "#7c3aed" : "hsl(240, 15%, 10%)",
                                transition: "color 150ms ease",
                            }
                        }}
                    />
                </ListItemButton>

                <Typography className="sidebar__nav-section" sx={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    color: "hsl(240, 8%, 50%)",
                    px: 1.5,
                    pt: 2.5,
                    pb: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}>
                    Categories
                </Typography>

                {categories.map((cat) => {
                    const isActive = isDashboard && isOnMainLayout && activeCategory === cat.key;
                    return (
                        <ListItemButton className="sidebar__nav-item"
                            key={cat.key}
                            selected={isActive}
                            onClick={() => handleCategoryClick(cat.key)}
                            sx={{
                                borderRadius: "10px",
                                mb: 0.25,
                                py: 0.85,
                                px: 1.5,
                                position: "relative",
                                "&.Mui-selected": {
                                    bgcolor: `${cat.soft}`,
                                    "&:hover": { bgcolor: `${cat.soft}` },
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 3,
                                        height: 25,
                                        borderRadius: "0 4px 4px 0",
                                        background: cat.gradient,
                                    },
                                },
                                "&:hover": {
                                    bgcolor: `${cat.soft}`,
                                },
                            }}
                        >
                            <ListItemIcon className="sidebar__nav-icon" sx={{ minWidth: 30 }}>
                                <RoundedGoalIcon className="sidebar__nav-icon-element" iconKey={cat.iconKey} sx={{
                                    color: cat.text,
                                    fontSize: 16,
                                    transition: "color 150ms ease",
                                }} />
                            </ListItemIcon>
                            <ListItemText className="sidebar__nav-text"
                                primary={cat.label}
                                slotProps={{
                                    primary: {
                                        fontSize: 13,
                                        fontWeight: isActive ? 700 : 600,
                                        color: isActive ? cat.text : "hsl(240, 15%, 40%)",
                                        transition: "color 150ms ease",
                                    }
                                }}
                            />
                            {isActive && (
                                <Box className="sidebar__nav-dot" sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: cat.gradient,
                                    flexShrink: 0,
                                }} />
                            )}
                        </ListItemButton>
                    );
                })}
            </List>

            <Box className="sidebar__footer" sx={{ px: 2, pb: 2, pt: 1 }}>
                <Button className="sidebar__create-btn"
                    variant="contained"
                    fullWidth
                    onClick={onCreate}
                    startIcon={<PiPlusBold />}
                    sx={{
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        color: "#fff",
                        py: 1.2,
                        fontSize: 13.5,
                        fontWeight: 700,
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgb(124, 58, 237 / .25)",
                        transition: "all 150ms ease",
                        "&:hover": {
                            background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                            boxShadow: "0 4px 16px rgb(124, 58, 237 / .35)",
                            transform: "translateY(-1px)",
                        },
                        "&:active": {
                            transform: "translateY(0)",
                        },
                    }}
                >
                    New Goal
                </Button>
            </Box>
        </Box>
    );
}

function MainLayout() {
    const dispatch = useDispatch();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const goals = useSelector((state) => state.goals.items);
    const categories = useSelector((state) => state.config.categories);
    const loading = useSelector((state) => state.goals.loading);
    const { handleOpenCreate } = useGoalActions();

    useEffect(() => {
        dispatch(fetchGoals());
    }, [dispatch]);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const isDetail = location.pathname.startsWith("/goals/") && !location.pathname.endsWith("/new") && !location.pathname.endsWith("/edit");

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

    const sidebar = (
        <Sidebar
            categories={categories}
            onCreate={() => { handleOpenCreate(); setMobileOpen(false); }}
            onClose={() => setMobileOpen(false)}
        />
    );

    return (
        <Box className="main-layout" sx={{
            minHeight: "100dvh",
            background: "hsl(240, 20%, 97%)",
            display: "flex",
        }}>
            <ToastContainer className="main-layout__toast"
                position="bottom-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Zoom}
            />

            {isMobile ? (
                <Drawer className="main-layout__drawer"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    PaperProps={{
                        sx: {
                            borderRight: "1px solid hsl(240, 10%, 90%)",
                            width: SIDEBAR_WIDTH,
                        }
                    }}
                >
                    {sidebar}
                </Drawer>
            ) : (
                sidebar
            )}

            <Box className="main-layout__content" sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
            }}>
                {!isDetail && (
                    <Box className="main-layout__header"
                        sx={{
                            px: { xs: 2, sm: 3.5 },
                            pt: { xs: 2, sm: 3 },
                            pb: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        {isMobile && (
                            <IconButton className="main-layout__menu-btn"
                                onClick={() => setMobileOpen(true)}
                                size="small"
                                sx={{
                                    color: "#fff",
                                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                    boxShadow: "0 1px 3px rgb(0 0 0 / .06)",
                                }}
                            >
                                <PiListBold sx={{ fontSize: 22 }} />
                            </IconButton>
                        )}
                        <Box className="main-layout__title" sx={{ flex: 1 }}>
                            <Typography className="main-layout__page-title"
                                component="h1"
                                sx={{
                                    fontFamily: "'Sora', sans-serif",
                                    fontSize: { xs: 22, sm: 26 },
                                    fontWeight: 800,
                                    color: "hsl(240, 15%, 10%)",
                                    lineHeight: 1.15,
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                {location.pathname === "/list" ? "All Goals" : "Dashboard"}
                            </Typography>
                            <Typography className="main-layout__subtitle" sx={{
                                mt: 0.25,
                                fontSize: { xs: 13, sm: 14 },
                                color: "hsl(240, 8%, 50%)",
                                fontWeight: 500,
                            }}>
                                {location.pathname === "/list"
                                    ? "View all goals in one place"
                                    : "Track your goals by category"
                                }
                            </Typography>
                        </Box>
                        {isMobile && (
                            <Button className="main-layout__new-btn"
                                variant="contained"
                                onClick={() => handleOpenCreate()}
                                startIcon={<PiPlusBold />}
                                size="small"
                                sx={{
                                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                    color: "#fff",
                                    px: 2,
                                    boxShadow: "0 2px 8px rgb(124, 58, 237 / .25)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                                        boxShadow: "0 4px 12px rgb(124, 58, 237 / .35)",
                                    },
                                }}
                            >
                                New
                            </Button>
                        )}
                    </Box>
                )}

                <Box className="main-layout__page" sx={{
                    px: { xs: 2, sm: 3.5 },
                    pb: 4,
                    flex: 1,
                    overflowY: "auto",
                    pt: isDetail ? { xs: 2, sm: 3 } : undefined,
                }}>
                    {isDetail ? (
                        <Outlet />
                    ) : (
                        <Stack className="main-layout__stack" spacing={2.5}>
                            <ProgressSummary stats={stats} goals={goals} categories={categories} />

                            {loading ? (
                                <Box className="main-layout__loading" sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    py: 10,
                                }}>
                                    <CircularProgress className="main-layout__spinner"
                                        size={36}
                                        sx={{ color: "#7c3aed" }}
                                    />
                                </Box>
                            ) : goals.length === 0 ? (
                                <Box className="main-layout__empty"
                                    sx={{
                                        textAlign: "center",
                                        py: 10,
                                        bgcolor: "#ffffff",
                                        borderRadius: "16px",
                                        border: "1px dashed hsl(240, 10%, 88%)",
                                        animation: "fadeInUp 300ms ease-out forwards",
                                    }}
                                >
                                    <Typography className="main-layout__empty-emoji" sx={{
                                        fontSize: 48,
                                        mb: 1.5,
                                        opacity: 0.8,
                                    }}>
                                        🎯
                                    </Typography>
                                    <Typography className="main-layout__empty-title" sx={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        fontFamily: "'Sora', sans-serif",
                                        color: "hsl(240, 15%, 10%)",
                                        mb: 0.5,
                                    }}>
                                        No goals yet
                                    </Typography>
                                    <Typography className="main-layout__empty-description" sx={{
                                        fontSize: 14,
                                        color: "hsl(240, 8%, 50%)",
                                        mb: 3,
                                        fontWeight: 500,
                                    }}>
                                        Create your first goal to start tracking your progress
                                    </Typography>
                                    <Button className="main-layout__empty-action"
                                        variant="contained"
                                        onClick={() => handleOpenCreate()}
                                        startIcon={<PiPlusBold />}
                                        sx={{
                                            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                            color: "#fff",
                                            px: 3,
                                            py: 1.25,
                                            fontSize: 14,
                                            boxShadow: "0 2px 8px rgb(124, 58, 237 / .25)",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                                                boxShadow: "0 4px 16px rgb(124, 58, 237 / .35)",
                                                transform: "translateY(-1px)",
                                            },
                                        }}
                                    >
                                        Create Goal
                                    </Button>
                                </Box>
                            ) : (
                                <Box className="main-layout__outlet" sx={{ animation: "fadeInUp 300ms ease-out forwards" }}>
                                    <Outlet />
                                </Box>
                            )}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default MainLayout;
