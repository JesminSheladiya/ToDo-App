import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#7c3aed", contrastText: "#ffffff" },
        secondary: { main: "#f0f1f5", contrastText: "#1a1d26" },
        background: {
            default: "hsl(240, 20%, 97%)",
            paper: "#ffffff"
        },
        text: {
            primary: "hsl(240, 15%, 10%)",
            secondary: "hsl(240, 8%, 50%)",
            disabled: "hsl(240, 6%, 70%)"
        },
        divider: "hsl(240, 10%, 90%)",
        error: { main: "#dc2626" },
        success: { main: "#16a34a" },
    },
    shape: { borderRadius: 14 },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        button: {
            fontWeight: 700,
            textTransform: "none",
        },
        h1: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.025em",
        },
        h2: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.025em",
        },
        h3: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.025em",
        },
        h4: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h5: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
        h6: {
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    transition: "background-color 200ms ease",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 14,
                },
                elevation1: {
                    boxShadow: "0 1px 3px rgb(0 0 0 / .06), 0 1px 2px rgb(0 0 0 / .04)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    boxShadow: "0 1px 3px rgb(0 0 0 / .06), 0 1px 2px rgb(0 0 0 / .04)",
                    border: "1px solid hsl(240, 10%, 90%)",
                    transition: "box-shadow 150ms ease, border-color 150ms ease",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgb(0 0 0 / .06)",
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                    minHeight: 40,
                    fontWeight: 700,
                    transition: "all 150ms ease",
                    "&:hover": {
                        boxShadow: "0 2px 8px rgb(0 0 0 / .1)",
                    },
                },
                sizeSmall: {
                    minHeight: 32,
                    borderRadius: 10,
                },
                contained: {
                    "&:hover": {
                        boxShadow: "0 4px 12px rgb(0 0 0 / .15)",
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "all 150ms ease",
                    "&:hover": {
                        backgroundColor: "hsl(240, 10%, 94%)",
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                    fontWeight: 500,
                    transition: "border-color 150ms ease, box-shadow 150ms ease",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 1.5,
                        borderColor: "hsl(240, 10%, 90%)",
                        transition: "border-color 150ms ease",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7c3aed",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#7c3aed",
                        borderWidth: 1.5,
                    },
                    "&.Mui-focused": {
                        boxShadow: "0 0 0 3px hsl(262, 83%, 95%)",
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    backgroundColor: "#ffffff",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    transition: "all 150ms ease",
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 18,
                    boxShadow: "0 20px 60px rgb(0 0 0 / .12), 0 8px 20px rgb(0 0 0 / .08)",
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    transition: "all 150ms ease",
                    "&:hover": {
                        backgroundColor: "hsl(262, 83%, 96%)",
                    },
                },
            },
        },
        MuiCollapse: {
            styleOverrides: {
                root: {
                    transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: "hsl(240, 15%, 10%)",
                },
            },
        },
        MuiBadge: {
            styleOverrides: {
                root: {
                    "& .MuiBadge-badge": {
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 11,
                    },
                },
            },
        },
    },
});

export default theme;
