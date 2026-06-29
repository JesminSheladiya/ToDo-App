import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../store/authSlice";
import {
    Box, Button, IconButton, InputAdornment, TextField, Typography, Link, CircularProgress,
} from "@mui/material";
import { MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        fontSize: 14,
        fontWeight: 500,
        bgcolor: "hsl(240, 20%, 98%)",
        py: 0.7,
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 88%)",
            borderWidth: 1.5,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
            borderWidth: 1.5,
        },
    },
    "& .MuiInputLabel-root": {
        fontWeight: 600,
        fontSize: 13,
        color: "hsl(240, 8%, 45%)",
        "&.Mui-focused": {
            color: "#7c3aed",
        },
    },
};

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const disabled = !email.trim() || !password;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(login({ email: email.trim(), password }));
        if (login.fulfilled.match(result)) {
            toast.success("Signed in successfully");
        } else {
            toast.error(result.payload || "Invalid email or password");
            setLoading(false);
        }
    };

    return (
        <Box className="login-page__container" sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(240, 20%, 97%)",
            px: 2,
        }}>
            <Box className="login-page__card" sx={{
                width: "100%",
                maxWidth: 420,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgb(0 0 0 / .06)",
                border: "1px solid hsl(240, 10%, 90%)",
                p: { xs: 3, sm: 4.5 },
            }}>
                <Box className="login-page__header" sx={{ textAlign: "center", mb: 4 }}>
                    <Typography className="login-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Welcome!
                    </Typography>
                    <Typography className="login-page__subtitle" sx={{
                        fontSize: 14,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                    }}>
                        Sign in to continue to Goal ToDo
                    </Typography>
                </Box>

                <Box className="login-page__form" component="form" onSubmit={handleSubmit} noValidate>
                    <Typography className="login-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Email
                    </Typography>
                    <TextField
                        className="login-page__email-input"
                        fullWidth
                        placeholder="john@example.com"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="login-page__input-adornment" position="start">
                                        <FiMail size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Typography className="login-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Password
                    </Typography>
                    <TextField
                        className="login-page__password-input"
                        fullWidth
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 3, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="login-page__input-adornment" position="start">
                                        <MdPassword size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="login-page__input-adornment" position="end">
                                        <IconButton className="login-page__toggle-btn" onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 30%)" }}>
                                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        className="login-page__submit-btn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={disabled || loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
                        sx={{
                            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                            color: "#fff",
                            py: 1.3,
                            fontSize: 15,
                            fontWeight: 700,
                            borderRadius: "12px",
                            boxShadow: "0 4px 16px rgb(124, 58, 237 / .25)",
                            transition: "all 150ms ease",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                                boxShadow: "0 6px 24px rgb(124, 58, 237 / .35)",
                            },
                            "&.Mui-disabled": {
                                background: "hsl(240, 10%, 85%)",
                                color: "hsl(240, 6%, 65%)",
                                boxShadow: "none",
                            },
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </Box>

                <Box className="login-page__forgot-box" sx={{ mt: 1.5, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                    <Link className="login-page__forgot-link" component="button" type="button" onClick={() => navigate("/forgot-password", { replace: true })} sx={{
                        color: "#7c3aed",
                        fontWeight: 700,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}>
                        Forgot Password?
                    </Link>
                </Box>

                <Typography className="login-page__register-text" sx={{ mt: 2, textAlign: "center", fontSize: 14, color: "hsl(240, 8%, 50%)" }}>
                    Don't have an account?{" "}
                    <Link className="login-page__register-link" component="button" type="button" onClick={() => navigate("/register", { replace: true })} sx={{
                        color: "#7c3aed",
                        fontWeight: 700,
                        textDecoration: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}>
                        Register
                    </Link>
                </Typography>
            </Box>
        </Box >
    );
}

export default LoginPage;
