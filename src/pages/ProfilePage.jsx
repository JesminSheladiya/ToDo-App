import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "../store/authSlice";
import {
    Box, Button, IconButton, InputAdornment, TextField, Typography, CircularProgress,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import { MdPassword, MdArrowBack } from "react-icons/md";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        fontSize: 14,
        fontWeight: 500,
        bgcolor: "hsl(240, 20%, 98%)",
        py: 0.5,
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 88%)",
            borderWidth: 1.5,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "hsl(240, 10%, 75%)",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c3aed",
            borderWidth: 1.5,
        },
    },
};

function ProfilePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const user = useSelector((state) => state.auth.user);

    const [name, setName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const initials = user?.name?.split(" ")[0]?.charAt(0)?.toUpperCase() + user?.name?.split(" ")[1]?.charAt(0)?.toUpperCase();

    const hasNameChange = name.trim() !== (user?.name || "");
    const hasPasswordChange = currentPassword || newPassword || confirmPassword;
    const hasChanges = hasNameChange || hasPasswordChange;

    const handleUpdate = async () => {
        if (hasNameChange && !name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (hasNameChange && name.trim().split("\\s+").length < 2) {
            toast.error("First and last name required");
            return;
        }
        if (hasPasswordChange) {
            if (!currentPassword) { toast.error("Current password is required"); return; }
            if (!newPassword) { toast.error("New password is required"); return; }
            if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
            if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
                toast.error("Must contain 1 letter, 1 number, and 1 symbol");
                return;
            }
            if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
        }

        setLoading(true);
        const result = await dispatch(updateProfile({
            name: hasNameChange ? name.trim() : undefined,
            currentPassword: hasPasswordChange ? currentPassword : undefined,
            newPassword: hasPasswordChange ? newPassword : undefined,
        }));
        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast.error(result.payload || "Failed to update profile");
        }
        setLoading(false);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            {/* Top Bar */}
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        size="small"
                        sx={{
                            color: "hsl(240, 15%, 10%)",
                            "&:hover": { bgcolor: "hsl(240, 20%, 96%)" },
                        }}
                    >
                        <MdArrowBack sx={{ fontSize: 22 }} />
                    </IconButton>
                    <Typography sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: 20, sm: 24 },
                        color: "hsl(240, 15%, 10%)",
                        letterSpacing: "-0.03em",
                    }}>
                        Profile
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    disabled={!hasChanges || loading}
                    onClick={handleUpdate}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        color: "#fff",
                        px: { xs: 2, sm: 3 },
                        py: 1,
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: "10px",
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgb(124, 58, 237 / .2)",
                        minWidth: { xs: 68, sm: "auto" },
                        "&:hover": {
                            background: "linear-gradient(135deg, #6d28d9, #9333ea)",
                            boxShadow: "0 4px 12px rgb(124, 58, 237 / .3)",
                        },
                        "&.Mui-disabled": {
                            background: "hsl(240, 10%, 88%)",
                            color: "hsl(240, 6%, 65%)",
                            boxShadow: "none",
                        },
                    }}
                >
                    {loading ? "Saving..." : isMobile ? "Save" : "Save Changes"}
                </Button>
            </Box>

            {/* User Info Card */}
            <Box sx={{
                bgcolor: "#fff",
                borderRadius: "14px",
                border: "1px solid hsl(240, 10%, 90%)",
                boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
                p: { xs: 2.5, sm: 3 },
                mb: 1.5,
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ position: "relative", flexShrink: 0 }}>
                        <Box sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                            display: "grid",
                            placeItems: "center",
                            color: "#fff",
                            fontSize: 22,
                            fontWeight: 800,
                            fontFamily: "'Sora', sans-serif",
                            boxShadow: "0 4px 12px rgb(124, 58, 237 / .25)",
                        }}>
                            {initials}
                        </Box>
                        <Box sx={{
                            position: "absolute",
                            bottom: -2,
                            right: -2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            bgcolor: "#02a710",
                            border: "2px solid #fff",
                        }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800,
                            fontSize: 18,
                            color: "hsl(240, 15%, 10%)",
                            letterSpacing: "-0.025em",
                            lineHeight: 1.2,
                        }}>
                            {user?.name || "User"}
                        </Typography>
                        <Typography sx={{
                            fontSize: 13,
                            color: "hsl(240, 8%, 50%)",
                            fontWeight: 500,
                            mt: 0.3,
                        }}>
                            {user?.email || ""}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* General Card */}
            <Box sx={{
                bgcolor: "#fff",
                borderRadius: "14px",
                border: "1px solid hsl(240, 10%, 90%)",
                boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
                p: { xs: 2.5, sm: 3 },
                mb: 1.5,
            }}>
                <Typography sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "hsl(240, 15%, 10%)",
                    letterSpacing: "-0.01em",
                    mb: 2,
                }}>
                    General
                </Typography>

                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Full Name
                </Typography>
                <TextField
                    fullWidth
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, ...inputSx }}
                />

                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Email
                </Typography>
                <TextField
                    fullWidth
                    value={user?.email || ""}
                    variant="outlined"
                    size="small"
                    disabled
                    sx={inputSx}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoMail size={16} style={{ color: "hsl(240, 10%, 65%)" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>

            {/* Password Card */}
            <Box sx={{
                bgcolor: "#fff",
                borderRadius: "14px",
                border: "1px solid hsl(240, 10%, 90%)",
                boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
                p: { xs: 2.5, sm: 3 },
            }}>
                <Typography sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "hsl(240, 15%, 10%)",
                    letterSpacing: "-0.01em",
                    mb: 2,
                }}>
                    Password
                </Typography>

                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Current Password
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter current password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, ...inputSx }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdPassword size={16} style={{ color: "hsl(240, 10%, 65%)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrent((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 55%)" }}>
                                        {showCurrent ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    New Password
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Enter new password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2, ...inputSx }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdPassword size={16} style={{ color: "hsl(240, 10%, 65%)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 55%)" }}>
                                        {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 0.75, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Confirm Password
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Re-enter new password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={inputSx}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MdPassword size={16} style={{ color: "hsl(240, 10%, 65%)" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowConfirm((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 55%)" }}>
                                        {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

export default ProfilePage;
