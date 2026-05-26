import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#7c3aed",
            contrastText: "#ffffff",
        },

        secondary: {
            main: "#f4f4f5",
            contrastText: "#27272a",
        },

        background: {
            default: "#f7f7fb",
            paper: "#ffffff",
        },

        text: {
            primary: "#18181b",
            secondary: "#71717a",
        },

        divider: "#e4e4e7",
    },

    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        button: {
            fontWeight: 700,
            textTransform: "none",
        },
    },

    shape: {
        borderRadius: 8,
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                rounded: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                    fontWeight: 500,
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: "#ffffff",
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
