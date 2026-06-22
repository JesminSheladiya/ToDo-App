import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPassword } from "../store/authSlice";
import {
    Box, Button, InputAdornment, TextField, Typography, Link, CircularProgress,
} from "@mui/material";
import { IoMail } from "react-icons/io5";
import { TbArrowLeft } from "react-icons/tb";

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
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d32f2f",
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
    "& .MuiFormHelperText-root": {
        ml: 0,
        mt: 0.5,
        fontSize: 12,
        fontWeight: 500,
    },
};

function ForgotPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disabled = !email.trim() || loading;

    const validateEmail = () => {
        if (!email.trim()) {
            setEmailError("Email is required");
            return false;
        }
        if (!emailRegex.test(email.trim())) {
            setEmailError("Please enter a valid email address");
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail()) return;
        setLoading(true);

        const result = await dispatch(forgotPassword({ email: email.trim() }));
        if (forgotPassword.fulfilled.match(result)) {
            toast.success("OTP sent to your email");
            navigate("/verify-otp", { state: { email: email.trim() }, replace: true });
        } else {
            toast.error(result.payload || "Email is not registered");
        }
        setLoading(false);
    };

    return (
        <Box className="forgot-password-page__container" sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(240, 20%, 97%)",
            px: 2,
        }}>
            <Box className="forgot-password-page__card" sx={{
                width: "100%",
                maxWidth: 420,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgb(0 0 0 / .06)",
                border: "1px solid hsl(240, 10%, 90%)",
                p: { xs: 3, sm: 4.5 },
            }}>
                <Box className="forgot-password-page__header" sx={{ textAlign: "center", mb: 4 }}>
                    <Typography className="forgot-password-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Forgot Password?
                    </Typography>
                    <Typography className="forgot-password-page__subtitle" sx={{
                        fontSize: 14,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                        lineHeight: 1.5,
                    }}>
                        Enter your email and we'll send you a one-time password to reset your account.
                    </Typography>
                </Box>

                <Box className="forgot-password-page__form" component="form" onSubmit={handleSubmit} noValidate>
                    <Typography className="forgot-password-page__label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Email
                    </Typography>
                    <TextField
                        className="forgot-password-page__email-input"
                        fullWidth
                        placeholder="john@example.com"
                        type="text"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                        }}
                        onBlur={validateEmail}
                        error={!!emailError}
                        helperText={emailError}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 3, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="forgot-password-page__input-adornment" position="start">
                                        <IoMail size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        className="forgot-password-page__submit-btn"
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
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                </Box>

                <Typography className="forgot-password-page__back-text" sx={{ mt: 2.5, textAlign: "center", fontSize: 14, color: "hsl(240, 8%, 50%)" }}>
                    <Link className="forgot-password-page__back-link" component="button" type="button" onClick={() => navigate("/login", { replace: true })} sx={{
                        color: "#7c3aed",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": { textDecoration: "underline" },
                    }}>
                        <TbArrowLeft size={16} />
                        Back to Sign In
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default ForgotPasswordPage;
