import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: "#7c4dff",
        },

        secondary: {
            main: "#00c6ff",
        },

        background: {
            default: "#0f172a",
            paper: "#1e293b",
        },
    },

    typography: {
        fontFamily: "Roboto, sans-serif",
    },

    shape: {
        borderRadius: 18,
    },
});

export default theme;