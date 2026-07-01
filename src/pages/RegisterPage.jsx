import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../store/authSlice";
import {
    Box, Button, IconButton, InputAdornment, TextField, Typography, CircularProgress,
    Tab, Tabs
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
            }}>
                <Box className="register-page__header" sx={{ textAlign: "center", mb: 4 }}>
                    <Typography className="register-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Create account
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
                    <Box className="register-page__input-wrapper" sx={{ mb: 2.5 }}>
                        <TextField
                            className="register-page__name-input"
                            fullWidth
                            placeholder="John Doe"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ ...inputSx }}
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
                    </Box>
                    <Box className="register-page__input-wrapper" sx={{ mb: 2.5 }}>
                        <TextField
                            className="register-page__email-input"
                            fullWidth
                            placeholder="john@example.com"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ ...inputSx }}
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
                    </Box>
                    <Box className="register-page__input-wrapper" sx={{ mb: 2.5 }}>
                        <TextField
                            className="register-page__password-input"
                            fullWidth
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ ...inputSx }}
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
                    </Box>
                    <Box className="register-page__input-wrapper" sx={{ mb: 3 }}>
                        <TextField
                            className="register-page__confirm-password-input"
                            fullWidth
                            placeholder="Re-enter your password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ ...inputSx }}
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
                    </Box>
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

                <Typography className="register-page__separator" sx={{ mt: 2, mb: 1, fontSize: 13, color: "hsl(240, 8%, 50%)", textAlign: "center" }}>or</Typography>

                <Typography className="register-page__login-text" sx={{ mt: 2, textAlign: "center", fontSize: 14, color: "hsl(240, 8%, 50%)" }}>
                    Already have an account?{" "}
                    <Box component="span" onClick={() => navigate("/login", { replace: true })} sx={{ color: "#7c3aed", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                        Sign in
                    </Box>
                </Typography>
            </Box>
        </Box>
    );
}

export default RegisterPage;
