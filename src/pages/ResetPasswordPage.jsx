import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../store/authSlice";
import {
    Box, Button, IconButton, InputAdornment, TextField, Typography, CircularProgress,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { MdPassword } from "react-icons/md";

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
        "&.Mui-focused": { color: "#7c3aed" },
    },
    "& .MuiFormHelperText-root": {
        ml: 0,
        mt: 0.5,
        fontSize: 12,
        fontWeight: 500,
    },
};

function ResetPasswordPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, otp, navigate]);

    const validate = () => {
        const errs = {};
        if (!newPassword) {
            errs.newPassword = "New password is required";
        } else if (newPassword.length < 6) {
            errs.newPassword = "Password must be at least 6 characters";
        } else if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            errs.newPassword = "Must contain 1 letter, 1 number, and 1 symbol";
        }
        if (!confirmPassword) {
            errs.confirmPassword = "Confirm password is required";
        } else if (confirmPassword !== newPassword) {
            errs.confirmPassword = "Passwords do not match";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const clearError = (field) => {
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        const result = await dispatch(resetPassword({
            email,
            otp,
            newPassword,
            confirmPassword,
        }));
        if (resetPassword.fulfilled.match(result)) {
            toast.success("Password changed successfully! Please sign in");
            navigate("/login", { replace: true });
        } else {
            toast.error(result.payload || "Failed to change password");
        }
        setLoading(false);
    };

    return (
        <Box sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(240, 20%, 97%)",
            px: 2,
        }}>
            <Box sx={{
                width: "100%",
                maxWidth: 420,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgb(0 0 0 / .06)",
                border: "1px solid hsl(240, 10%, 90%)",
                p: { xs: 3, sm: 4.5 },
            }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Typography sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Change Password
                    </Typography>
                    <Typography sx={{
                        fontSize: 14,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                        lineHeight: 1.5,
                    }}>
                        Enter your current and new password
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        New Password
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter new password"
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); clearError("newPassword"); }}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdPassword size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNew((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 30%)" }}>
                                            {showNew ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 20%)", mb: 0.2 }}>
                        Confirm Password
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Re-enter new password"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 3, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <MdPassword size={18} style={{ color: "hsl(240, 10%, 30%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 30%)" }}>
                                            {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
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
                        {loading ? "Changing Password..." : "Change Password"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPasswordPage;
