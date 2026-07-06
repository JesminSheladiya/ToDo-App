import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../store/authSlice";
import {
    Box, Button, IconButton, InputAdornment, TextField, Typography, Link, CircularProgress,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";
import { FiMail } from "react-icons/fi";
import { LiaUserSolid } from "react-icons/lia";

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        fontSize: 14,
        bgcolor: "hsl(240, 20%, 98%)",
        py: 0.7,
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 88%)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 78%)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
        },
    },
    "& .MuiInputBase-input::placeholder": {
        color: "hsl(240, 10%, 72%)",
        opacity: 1,
    },
};

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const disabled = !name.trim() || !email.trim() || !password || !confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await dispatch(register({
            name: name.trim(),
            email: email.trim(),
            password,
            confirmPassword,
        }));
        if (register.fulfilled.match(result)) {
            toast.success("Account created successfully");
        } else {
            toast.error(result.payload || "Registration failed");
            setLoading(false);
        }
    };

    return (
        <Box className="register-page__container" sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(240, 20%, 97%)",
            px: 2,
        }}>
            <Box className="register-page__card" sx={{
                width: "100%",
                maxWidth: 420,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgb(0 0 0 / .06)",
                border: "1px solid hsl(240, 10%, 90%)",
                p: { xs: 3, sm: 4.5 },
                my: 4,
            }}>
                <Box className="register-page__tabs" sx={{
                    display: "flex",
                    bgcolor: "hsl(240, 10%, 92%)",
                    border: "1px solid hsl(240, 10%, 90%)",
                    borderRadius: "14px",
                    p: "5px",
                    mb: 3,
                    boxShadow: "inset 0 2px 6px rgb(0 0 0 / .08), 0 1px 2px rgb(255 255 255 / .6)",
                }}>
                    <Box
                        className="register-page__tab"
                        component="button"
                        onClick={() => navigate("/login", { replace: true })}
                        sx={{
                            flex: 1,
                            py: 1.1,
                            border: "none",
                            borderRadius: "10px",
                            bgcolor: "transparent",
                            color: "hsl(240, 8%, 50%)",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                            fontFamily: "inherit",
                            "&:hover": {
                                color: "#7c3aed",
                            },
                            "&:active": {
                                transform: "scale(0.96)",
                            },
                        }}
                    >
                        Sign in
                    </Box>
                    <Box
                        className="register-page__tab register-page__tab--active"
                        sx={{
                            flex: 1,
                            py: 1.1,
                            borderRadius: "10px",
                            background: "linear-gradient(145deg, #8b4cf6, #7c3aed)",
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: 600,
                            textAlign: "center",
                            boxShadow: "0 4px 14px rgb(124, 58, 237 / .35), 0 1px 3px rgb(124, 58, 237 / .2), inset 0 1px 1px rgb(255 255 255 / .15)",
                            transform: "translateY(-1px)",
                            letterSpacing: 0.3,
                            transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                            "@keyframes fadeIn": {
                                "0%": { opacity: 0, transform: "translateY(-1px) scale(0.95)" },
                                "100%": { opacity: 1, transform: "translateY(-1px) scale(1)" },
                            },
                            animation: "fadeIn 0.35s ease forwards",
                        }}
                    >
                        Sign up
                    </Box>
                </Box>

                <Box className="register-page__header" sx={{ textAlign: "center", mb: 3 }}>
                    <Typography className="register-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 22,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Create an account
                    </Typography>
                    <Typography className="register-page__subtitle" sx={{
                        fontSize: 14,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                    }}>
                        Start tracking your goals today
                    </Typography>
                </Box>

                <Box className="register-page__form" component="form" onSubmit={handleSubmit} noValidate>
                    <Typography className="register-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Full Name
                    </Typography>
                    <TextField
                        className="register-page__name-input"
                        fullWidth
                        placeholder="John Doe"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="register-page__input-adornment" position="start">
                                        <LiaUserSolid size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Typography className="register-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Email
                    </Typography>
                    <TextField
                        className="register-page__email-input"
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
                                    <InputAdornment className="register-page__input-adornment" position="start">
                                        <FiMail size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Typography className="register-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Password
                    </Typography>
                    <TextField
                        className="register-page__password-input"
                        fullWidth
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="register-page__input-adornment" position="start">
                                        <MdPassword size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="register-page__input-adornment" position="end">
                                        <IconButton className="register-page__toggle-btn" onClick={() => setShowPassword((prev) => !prev)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 30%)" }}>
                                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Typography className="register-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Confirm Password
                    </Typography>
                    <TextField
                        className="register-page__confirm-password-input"
                        fullWidth
                        placeholder="Re-enter your password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="register-page__input-adornment" position="start">
                                        <MdPassword size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="register-page__input-adornment" position="end">
                                        <IconButton className="register-page__toggle-btn" onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 30%)" }}>
                                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        className="register-page__submit-btn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={disabled || loading}
                        startIcon={loading ? <CircularProgress className="register-page__spinner" size={18} color="inherit" /> : null}
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
                        {loading ? "Creating account..." : "Create Account"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default RegisterPage;
