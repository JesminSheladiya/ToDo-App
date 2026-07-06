import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtp, forgotPassword } from "../store/authSlice";
import {
    Box, Button, Typography, Link, CircularProgress, TextField,
} from "@mui/material";
import { TbArrowLeft } from "react-icons/tb";

const DIGIT_COUNT = 6;

const digitFieldSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        height: 56,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'Sora', sans-serif",
        bgcolor: "hsl(240, 20%, 98%)",
        textAlign: "center",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 88%)",
            borderWidth: 1.5,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
            borderWidth: 2,
            boxShadow: "0 0 0 3px rgb(124, 58, 237 / .12)",
        },
    },
    "& .MuiInputBase-input": {
        textAlign: "center",
        padding: "0",
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 0,
    },
};

function OtpVerificationPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [digits, setDigits] = useState(Array(DIGIT_COUNT).fill(""));
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [resendTimer]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = useCallback((index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value.slice(-1);
        setDigits(newDigits);

        if (value && index < DIGIT_COUNT - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [digits]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [digits]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGIT_COUNT);
        if (!pasted) return;
        const newDigits = [...digits];
        pasted.split("").forEach((ch, i) => { newDigits[i] = ch; });
        setDigits(newDigits);
        const nextIndex = Math.min(pasted.length, DIGIT_COUNT - 1);
        inputRefs.current[nextIndex]?.focus();
    }, [digits]);

    const otp = digits.join("");
    const isComplete = otp.length === DIGIT_COUNT;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isComplete) return;
        setLoading(true);

        const result = await dispatch(verifyOtp({ email, otp }));
        if (verifyOtp.fulfilled.match(result)) {
            toast.success("OTP verified successfully");
            navigate("/reset-password", { state: { email, otp }, replace: true });
        } else {
            toast.error(result.payload || "Invalid or expired OTP");
            setDigits(Array(DIGIT_COUNT).fill(""));
            inputRefs.current[0]?.focus();
        }
        setLoading(false);
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendLoading(true);

        const result = await dispatch(forgotPassword({ email }));
        if (forgotPassword.fulfilled.match(result)) {
            toast.success("OTP resent to your email");
            setResendTimer(30);
        } else {
            toast.error(result.payload || "Failed to resend OTP");
        }
        setResendLoading(false);
    };

    return (
        <Box className="otp-page__container" sx={{
            minHeight: "100dvh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(240, 20%, 97%)",
            px: 2,
        }}>
            <Box className="otp-page__card" sx={{
                width: "100%",
                maxWidth: 420,
                bgcolor: "#ffffff",
                borderRadius: "20px",
                boxShadow: "0 4px 24px rgb(0 0 0 / .06)",
                border: "1px solid hsl(240, 10%, 90%)",
                p: { xs: 3, sm: 4.5 },
            }}>
                <Box className="otp-page__header" sx={{ textAlign: "center", mb: 4 }}>
                    <Typography className="otp-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: 24,
                        color: "hsl(240, 15%, 10%)",
                        mb: 0.5,
                    }}>
                        Verify OTP
                    </Typography>
                    <Typography className="otp-page__subtitle" sx={{
                        fontSize: 14,
                        color: "hsl(240, 8%, 50%)",
                        fontWeight: 500,
                        lineHeight: 1.5,
                    }}>
                        Enter the 6-digit code sent to
                    </Typography>
                    <Typography className="otp-page__email" sx={{
                        fontSize: 14,
                        color: "hsl(240, 15%, 10%)",
                        fontWeight: 700,
                        mt: 0.3,
                    }}>
                        {email}
                    </Typography>
                </Box>

                <Box className="otp-page__form" component="form" onSubmit={handleSubmit} noValidate>
                    <Box
                        className="otp-page__digits-container"
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: { xs: 1, sm: 1.5 },
                            mb: 3,
                        }}
                        onPaste={handlePaste}
                    >
                        {digits.map((digit, i) => (
                            <TextField
                                key={i}
                                className="otp-page__digit-input"
                                inputRef={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: 22, fontWeight: 700, padding: "0" } }}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    width: { xs: 44, sm: 50 },
                                    ...digitFieldSx,
                                }}
                            />
                        ))}
                    </Box>

                    <Button
                        className="otp-page__submit-btn"
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!isComplete || loading}
                        startIcon={loading ? <CircularProgress className="otp-page__spinner" size={18} color="inherit" /> : null}
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
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                </Box>

                <Box className="otp-page__resend-box" sx={{ mt: 2.5, textAlign: "center", fontSize: 14, fontWeight: 600 }}>
                    {resendTimer > 0 ? (
                        <Typography className="otp-page__resend-timer" sx={{ color: "hsl(240, 8%, 50%)", fontSize: 14 }}>
                            Resend OTP in{" "}
                            <Box className="otp-page__timer-value" component="span" sx={{ color: "#7c3aed", fontWeight: 700 }}>
                                {resendTimer}s
                            </Box>
                        </Typography>
                    ) : (
                        <Link
                            className="otp-page__resend-link"
                            component="button"
                            type="button"
                            onClick={handleResend}
                            disabled={resendLoading}
                            sx={{
                                color: "#7c3aed",
                                fontWeight: 700,
                                fontSize: 14,
                                textDecoration: "none",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "inherit",
                                p: 0,
                                "&:hover": { textDecoration: "underline" },
                                "&.Mui-disabled": { color: "hsl(240, 8%, 65%)", cursor: "default" },
                            }}
                        >
                            {resendLoading ? "Resending..." : "Resend OTP"}
                        </Link>
                    )}
                </Box>

                <Typography className="otp-page__change-email-text" sx={{ mt: 2, textAlign: "center", fontSize: 14, color: "hsl(240, 8%, 50%)" }}>
                    <Link className="otp-page__change-email-link" component="button" type="button" onClick={() => navigate("/forgot-password", { replace: true })} sx={{
                        color: "#7c3aed",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        "&:hover": { textDecoration: "underline" },
                    }}>
                        <TbArrowLeft size={16} />
                        Change Email
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
}

export default OtpVerificationPage;
