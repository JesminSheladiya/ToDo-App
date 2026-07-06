import { useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateProfile } from "../store/authSlice";
import api from "../api/api";
import {
    Box, Button, ClickAwayListener, Dialog,
    IconButton, InputAdornment, List, ListItemButton, ListItemIcon, ListItemText,
    Paper, Popper, TextField, Typography, CircularProgress, Slider, DialogActions,
} from "@mui/material";
import Cropper from "react-easy-crop";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { FaEye, FaEyeSlash, FaImage } from "react-icons/fa6";
import { IoCamera, IoClose, IoCalendarNumberOutline } from "react-icons/io5";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { MdPassword, MdArrowBack } from "react-icons/md";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FiMail, FiTrash } from "react-icons/fi";
import { LiaUserSolid } from "react-icons/lia";

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
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            cursor: "not-allowed",
            pointerEvents: "all",
        }
    },
};

const cardSx = {
    bgcolor: "#fff",
    borderRadius: "14px",
    border: "1px solid hsl(240, 10%, 90%)",
    boxShadow: "0 1px 2px rgb(0 0 0 / .05)",
    p: { xs: 2.5, sm: 3 },
    mb: 1.5,
};

const headingSx = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: 15,
    color: "hsl(240, 15%, 10%)",
    letterSpacing: "-0.01em",
    mb: 2,
};

const labelSx = {
    fontSize: 12,
    fontWeight: 600,
    color: "hsl(240, 8%, 40%)",
    mb: 0.75,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

function getCroppedImg(imageSrc, pixelCrop) {
    return new Promise((resolve) => {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                image,
                pixelCrop.x, pixelCrop.y,
                pixelCrop.width, pixelCrop.height,
                0, 0,
                pixelCrop.width, pixelCrop.height
            );
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg", 0.9);
        };
    });
}

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
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [dobDisplay, setDobDisplay] = useState(user?.dob ? dayjs(user.dob).format("DD/MM/YYYY") : "");
    const [dobValue, setDobValue] = useState(user?.dob || "");
    const [dobOpen, setDobOpen] = useState(false);
    const dobAnchorRef = useRef(null);

    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cropOpen, setCropOpen] = useState(false);
    const [cropData, setCropData] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef(null);
    const avatarAnchorRef = useRef(null);
    const [viewPhotoOpen, setViewPhotoOpen] = useState(false);

    const formatDobInput = (raw) => {
        const digits = raw.replace(/\D/g, "").slice(0, 8);
        if (digits.length <= 2) return digits;
        if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
        return digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4);
    };

    const parseDobDisplay = (val) => {
        const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return "";
        const [, dd, mm, yyyy] = match;
        const parsed = dayjs(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true);
        if (!parsed.isValid()) return "";
        return parsed.format("YYYY-MM-DD");
    };

    const handleDobInput = (e) => {
        setDobDisplay(formatDobInput(e.target.value));
    };

    const handleDobBlur = () => {
        const val = dobDisplay.trim();
        if (!val) { setDobValue(""); return; }
        const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) { toast.error("Enter date as DD/MM/YYYY"); setDobDisplay(""); setDobValue(""); return; }
        const [, dd, mm, yyyy] = match;
        const parsed = dayjs(`${yyyy}-${mm}-${dd}`, "YYYY-MM-DD", true);
        if (!parsed.isValid() || parsed.isAfter(dayjs())) { toast.error("Invalid date of birth"); setDobDisplay(""); setDobValue(""); return; }
        setDobValue(parsed.format("YYYY-MM-DD"));
    };

    const handleDobCalendarChange = (newDate) => {
        if (newDate && newDate.isValid()) {
            setDobValue(newDate.format("YYYY-MM-DD"));
            setDobDisplay(newDate.format("DD/MM/YYYY"));
        }
        setDobOpen(false);
    };

    const initials = (user?.name || "U").split(" ").map((w) => w.charAt(0).toUpperCase()).slice(0, 2).join("");

    const hasNameChange = name.trim() !== (user?.name || "");
    const dobFromDisplay = parseDobDisplay(dobDisplay.trim());
    const currentDobValue = dobValue || dobFromDisplay;
    const hasDobChange = currentDobValue !== (user?.dob || "");
    const hasProfileChanges = hasNameChange || hasDobChange;

    const hasPasswordChange = currentPassword || newPassword || confirmPassword;

    const handleSaveDobFromDisplay = () => {
        const parsed = parseDobDisplay(dobDisplay.trim());
        if (parsed && parsed !== dobValue) {
            setDobValue(parsed);
        } else if (!parsed && dobDisplay.trim()) {
            setDobDisplay("");
            setDobValue("");
        }
    };

    const handleSaveProfile = async () => {
        handleSaveDobFromDisplay();
        if (!name.trim()) { toast.error("Name is required"); return; }
        if (name.trim().split(/\s+/).length < 2) { toast.error("First and last name required"); return; }

        const dobToSend = parseDobDisplay(dobDisplay.trim());
        const finalDobChanged = dobToSend !== (user?.dob || "");

        setProfileLoading(true);
        const result = await dispatch(updateProfile({
            name: name.trim(),
            dob: finalDobChanged ? dobToSend : undefined,
        }));
        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated successfully");
            const updatedDob = result.payload?.dob || "";
            setDobValue(updatedDob);
            setDobDisplay(updatedDob ? dayjs(updatedDob).format("DD/MM/YYYY") : "");
        } else {
            toast.error(result.payload || "Failed to update profile");
        }
        setProfileLoading(false);
    };

    const handleCancelProfile = () => {
        setName(user?.name || "");
        setDobValue(user?.dob || "");
        setDobDisplay(user?.dob ? dayjs(user.dob).format("DD/MM/YYYY") : "");
    };

    const handleUpdatePassword = async () => {
        if (!currentPassword) { toast.error("Current password is required"); return; }
        if (!newPassword) { toast.error("New password is required"); return; }
        if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
        if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            toast.error("Must contain 1 letter, 1 number, and 1 symbol"); return;
        }
        if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }

        setPasswordLoading(true);
        const result = await dispatch(updateProfile({
            name: user?.name || "",
            currentPassword,
            newPassword,
        }));
        if (updateProfile.fulfilled.match(result)) {
            toast.success("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            toast.error(result.payload || "Failed to update password");
        }
        setPasswordLoading(false);
    };

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Only JPG, PNG, and WEBP files are allowed");
            return false;
        }
        if (file.size > MAX_SIZE) {
            toast.error("File size must be less than 5MB");
            return false;
        }
        return true;
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!validateFile(file)) return;
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
            setCropOpen(true);
            setZoom(1);
            setCropData({ x: 0, y: 0 });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const handleUploadClick = () => {
        setAvatarMenuOpen(false);
        fileInputRef.current?.click();
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropApply = async () => {
        if (!selectedImage || !croppedAreaPixels) return;
        setUploadLoading(true);
        try {
            const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);
            const formData = new FormData();
            formData.append("file", croppedBlob, "photo.jpg");

            const response = await api.post("/auth/upload-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const photoUrl = response.data.photo;
            dispatch(updateProfile.fulfilled({ ...user, photo: photoUrl }));
            const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
            savedUser.photo = photoUrl;
            localStorage.setItem("user", JSON.stringify(savedUser));

            toast.success("Profile photo updated");
            setCropOpen(false);
            setSelectedImage(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to upload photo");
        }
        setUploadLoading(false);
    };

    const handleRemovePhoto = async () => {
        setAvatarMenuOpen(false);
        try {
            const response = await api.put("/auth/remove-photo");
            dispatch(updateProfile.fulfilled(response.data));
            localStorage.setItem("user", JSON.stringify(response.data));
            toast.success("Profile photo removed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove photo");
        }
    };

    const handleCropClose = () => {
        setCropOpen(false);
        setSelectedImage(null);
        setZoom(1);
    };

    return (
        <Box className="profile-page__container" sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            <input className="profile-page__file-input" ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileSelect} />

            <Box className="profile-page__top-bar" sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
            }}>
                <Box className="profile-page__top-bar-left" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                        className="profile-page__back-btn"
                        onClick={() => navigate(-1)}
                        size="small"
                        sx={{
                            color: "hsl(240, 15%, 10%)",
                            "&:hover": { bgcolor: "hsl(240, 20%, 96%)" },
                        }}
                    >
                        <MdArrowBack className="profile-page__back-icon" sx={{ fontSize: 22 }} />
                    </IconButton>
                    <Typography className="profile-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: 20, sm: 24 },
                        color: "hsl(240, 15%, 10%)",
                        letterSpacing: "-0.03em",
                    }}>
                        Profile
                    </Typography>
                </Box>
            </Box>

            <Box className="profile-page__user-card" sx={{
                ...cardSx, mb: 1.5,
                overflow: "hidden",
                p: 0,
            }}>
                <Box className="profile-page__user-accent" sx={{
                    height: 4,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
                }} />
                <Box className="profile-page__user-row" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2, p: { xs: 2.5, sm: 3 } }}>
                    <Box className="profile-page__avatar-wrapper" sx={{ position: "relative", flexShrink: 0 }}>
                        {user?.photo ? (
                            <Box
                                onClick={() => setViewPhotoOpen(true)}
                                className="profile-page__avatar" sx={{
                                    width: 80, height: 80, borderRadius: "50%",
                                    backgroundImage: `url(${user.photo})`,
                                    backgroundSize: "cover", backgroundPosition: "center",
                                    boxShadow: "0 4px 12px rgb(124, 58, 237 / .25)",
                                    cursor: "pointer",
                                }} />
                        ) : (
                            <Box className="profile-page__avatar" sx={{
                                width: 80, height: 80, borderRadius: "50%",
                                background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
                                display: "grid", placeItems: "center",
                                color: "#fff", fontSize: 24, fontWeight: 800,
                                fontFamily: "'Sora', sans-serif",
                                boxShadow: "0 4px 12px rgb(124, 58, 237 / .25)",
                            }}>
                                {initials}
                            </Box>
                        )}
                        <Box ref={avatarAnchorRef} className="profile-page__camera-btn" onClick={() => setAvatarMenuOpen((p) => !p)} sx={{
                            position: "absolute",
                            bottom: 0, right: 0,
                            width: 28, height: 28, borderRadius: "50%",
                            bgcolor: "#7c3aed", border: "2px solid #fff",
                            display: "grid", placeItems: "center",
                            cursor: "pointer",
                            boxShadow: "0 2px 6px rgb(0 0 0 / .15)",
                            transition: "all 150ms ease",
                            "&:hover": { bgcolor: "#6d28d9", transform: "scale(1.1)" },
                        }}>
                            <IoCamera className="profile-page__camera-icon" size={14} color="#fff" />
                        </Box>
                    </Box>
                    <Box className="profile-page__user-info" sx={{ minWidth: 0, width: "100%", textAlign: { xs: "center", sm: "left" } }}>
                        <Typography className="profile-page__user-name" sx={{
                            fontFamily: "'Sora', sans-serif",
                            fontWeight: 800, fontSize: 18,
                            color: "hsl(240, 15%, 10%)",
                            letterSpacing: "-0.025em", lineHeight: 1.2,
                            wordWrap: "break-word", overflowWrap: "break-word",
                        }}>
                            {user?.name || "User"}
                        </Typography>
                        <Typography className="profile-page__user-email" sx={{
                            fontSize: 13, color: "hsl(240, 8%, 50%)",
                            fontWeight: 500, mt: 0.3,
                            wordWrap: "break-word", overflowWrap: "break-word",
                        }}>
                            {user?.email || ""}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Popper
                className="profile-page__avatar-popper"
                open={avatarMenuOpen}
                anchorEl={avatarAnchorRef.current}
                placement="bottom-start"
                sx={{ zIndex: 1400 }}
            >
                <Paper
                    className="profile-page__avatar-paper"
                    elevation={0}
                    sx={{
                        mt: 0.5,
                        borderRadius: "12px",
                        border: "1px solid hsl(240, 10%, 90%)",
                        boxShadow: "0 8px 24px rgb(0 0 0 / .12)",
                        minWidth: 180,
                        overflow: "hidden",
                    }}
                >
                    <ClickAwayListener className="profile-page__avatar-clickaway" onClickAway={() => setAvatarMenuOpen(false)}>
                        <List className="profile-page__avatar-menu-list" disablePadding>
                            {user?.photo && (
                                <ListItemButton className="profile-page__view-photo-btn" onClick={() => { setAvatarMenuOpen(false); setViewPhotoOpen(true); }} sx={{ py: 1, px: 2 }}>
                                    <ListItemIcon className="profile-page__view-photo-icon" sx={{ minWidth: 30 }}><FaEye className="profile-page__view-photo-svg" size={18} color="hsl(240, 8%, 40%)" /></ListItemIcon>
                                    <ListItemText className="profile-page__view-photo-text" primary="View Photo" primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
                                </ListItemButton>
                            )}
                            <ListItemButton className="profile-page__upload-photo-btn" onClick={handleUploadClick} sx={{ py: 1, px: 2 }}>
                                <ListItemIcon className="profile-page__upload-photo-icon" sx={{ minWidth: 30 }}><FaImage className="profile-page__upload-photo-svg" size={16} color="hsl(240, 8%, 40%)" /></ListItemIcon>
                                <ListItemText className="profile-page__upload-photo-text" primary={user?.photo ? "Change Photo" : "Upload Photo"} primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
                            </ListItemButton>
                            {user?.photo && (
                                <ListItemButton className="profile-page__remove-photo-btn" onClick={handleRemovePhoto} sx={{ py: 1, px: 2 }}>
                                    <ListItemIcon className="profile-page__remove-photo-icon" sx={{ minWidth: 30 }}><FiTrash className="profile-page__remove-photo-svg" size={18} color="#dc2626" /></ListItemIcon>
                                    <ListItemText className="profile-page__remove-photo-text" primary="Remove Photo" primaryTypographyProps={{ fontSize: 13, fontWeight: 600, color: "#dc2626" }} />
                                </ListItemButton>
                            )}
                        </List>
                    </ClickAwayListener>
                </Paper>
            </Popper>

            <Dialog
                className="profile-page__view-photo-dialog"
                open={viewPhotoOpen}
                onClose={() => setViewPhotoOpen(false)}
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "14px",
                        overflow: "hidden",
                        bgcolor: "transparent",
                    },
                    "& .MuiBackdrop-root": {
                        backdropFilter: "blur(3px)",
                        bgcolor: "rgba(0,0,0,0.3)",
                    }
                }}
            >
                <IconButton className="profile-page__view-photo-close-btn" onClick={() => setViewPhotoOpen(false)} sx={{
                    position: "absolute", top: 8, right: 8, zIndex: 1,
                    color: "#fff", bgcolor: "rgba(0,0,0,0.4)", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                }}>
                    <IoClose className="profile-page__view-photo-close-icon" size={22} />
                </IconButton>
                <Box className="profile-page__view-photo-wrapper" sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", p: 0 }}>
                    <Box
                        className="profile-page__view-photo-img"
                        component="img"
                        src={user?.photo}
                        alt="Profile"
                        sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain", bgcolor: "transparent" }}
                    />
                </Box>
            </Dialog>

            <Dialog className="profile-page__crop-dialog" open={cropOpen} onClose={handleCropClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "14px", overflow: "hidden" } }}>
                <Box className="profile-page__crop-wrapper" sx={{ position: "relative", width: "100%", height: 350, bgcolor: "#000" }}>
                    {selectedImage && (
                        <Cropper
                            className="profile-page__cropper"
                            image={selectedImage}
                            crop={cropData}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCropData}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    )}
                    {uploadLoading && (
                        <Box className="profile-page__crop-loading" sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", bgcolor: "rgba(0,0,0,0.5)", zIndex: 10 }}>
                            <CircularProgress className="profile-page__crop-spinner" size={40} sx={{ color: "#fff" }} />
                        </Box>
                    )}
                </Box>
                <Box className="profile-page__crop-controls" sx={{ px: 3, py: 2 }}>
                    <Typography className="profile-page__zoom-label" sx={{ fontSize: 12, fontWeight: 600, color: "hsl(240, 8%, 40%)", mb: 1 }}>Zoom</Typography>
                    <Slider
                        className="profile-page__zoom-slider"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_, v) => setZoom(v)}
                        sx={{ color: "#7c3aed", "& .MuiSlider-thumb": { width: 18, height: 18 } }}
                    />
                </Box>
                <DialogActions className="profile-page__crop-actions" sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
                    <Button className="profile-page__crop-cancel-btn" onClick={handleCropClose} sx={{ fontSize: 13, fontWeight: 700, color: "hsl(240, 8%, 50%)", textTransform: "none", borderRadius: "10px", px: 3, py: 1, "&:hover": { bgcolor: "hsl(240, 20%, 95%)" } }}>
                        Cancel
                    </Button>
                    <Button
                        className="profile-page__crop-apply-btn"
                        variant="contained"
                        onClick={handleCropApply}
                        disabled={uploadLoading}
                        sx={{
                            background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff",
                            fontSize: 13, fontWeight: 700, textTransform: "none", borderRadius: "10px", px: 3, py: 1,
                            boxShadow: "0 2px 8px rgb(124, 58, 237 / .2)",
                            "&:hover": { background: "linear-gradient(135deg, #6d28d9, #9333ea)" },
                            "&.Mui-disabled": { background: "hsl(240, 10%, 88%)", color: "hsl(240, 6%, 65%)" },
                        }}
                    >
                        {uploadLoading ? "Uploading..." : "Apply"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Box className="profile-page__cards-row" sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 1.5, mb: 0 }}>
                <Box className="profile-page__personal-card" sx={{ ...cardSx, flex: 1, mb: 0 }}>
                    <Typography className="profile-page__personal-heading" sx={headingSx}>
                        Personal Information
                    </Typography>

                    <Typography className="profile-page__label" sx={labelSx}>Name</Typography>
                    <TextField
                        className="profile-page__name-input"
                        fullWidth
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="profile-page__name-adornment" position="start">
                                        <LiaUserSolid className="profile-page__name-icon" size={18} style={{ color: "hsl(240, 10%, 40%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Typography className="profile-page__label" sx={labelSx}>Email</Typography>
                    <TextField
                        className="profile-page__email-input"
                        fullWidth
                        value={user?.email || ""}
                        variant="outlined"
                        size="small"
                        disabled
                        sx={{ mb: 2, ...inputSx }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="profile-page__email-adornment" position="start">
                                        <FiMail className="profile-page__email-icon" size={18} style={{ color: "hsl(240, 10%, 65%)" }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Typography className="profile-page__label" sx={{ ...labelSx, mt: 1 }}>Date of Birth</Typography>
                    <TextField
                        className="profile-page__dob-input"
                        fullWidth
                        placeholder="DD/MM/YYYY"
                        value={dobDisplay}
                        onChange={handleDobInput}
                        onBlur={handleDobBlur}
                        variant="outlined"
                        size="small"
                        sx={inputSx}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment className="profile-page__dob-adornment-start" position="start">
                                        <IoCalendarNumberOutline className="profile-page__dob-calendar-icon" size={18} style={{ color: "hsl(240, 10%, 40%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="profile-page__dob-adornment-end" position="end">
                                        <Box
                                            ref={dobAnchorRef}
                                            className="profile-page__dob-calendar-btn"
                                            onClick={() => setDobOpen((p) => !p)}
                                            sx={{ display: "flex", alignItems: "center", cursor: "pointer", color: "hsl(240, 10%, 40%)", "&:hover": { color: "#7c3aed" }, transition: "color 150ms ease" }}
                                        >
                                            <BiSolidCalendarEdit className="profile-page__dob-calendar-edit-icon" size={22} />
                                        </Box>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Popper className="profile-page__dob-popper" open={dobOpen} anchorEl={dobAnchorRef.current} placement="bottom-start" sx={{ zIndex: 1400 }}>
                        <Paper className="profile-page__dob-paper" elevation={0} sx={{
                            mt: 0.5, borderRadius: "14px",
                            border: "1px solid hsl(240, 10%, 90%)",
                            boxShadow: "0 8px 24px rgb(0 0 0 / .12)",
                        }}>
                            <ClickAwayListener className="profile-page__dob-clickaway" onClickAway={() => setDobOpen(false)}>
                                <Box className="profile-page__dob-calendar" sx={{
                                    ".MuiDateCalendar-root": { width: "auto", height: "100%" },
                                    ".MuiDayCalendar-slideTransition": { minHeight: 190 },
                                    ".MuiPickersCalendarHeader-root": { px: 1.5, fontFamily: "'Sora', sans-serif" },
                                    ".MuiPickersCalendarHeader-labelContainer": { fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: "hsl(240, 15%, 10%)", cursor: "pointer", "&:hover": { bgcolor: "hsl(240, 20%, 95%)", borderRadius: "6px" } },
                                    ".MuiPickersArrowSwitcher-root": { "& button": { color: "hsl(240, 8%, 50%)", width: 28, height: 28, borderRadius: "8px", "&:hover": { bgcolor: "hsl(240, 20%, 95%)" } } },
                                    ".MuiDayCalendar-weekDayLabel": { fontSize: 12, fontWeight: 600, color: "hsl(240, 15%, 10%)", fontFamily: "'Inter', sans-serif", width: 36, height: 30 },
                                    ".MuiDayCalendar-weekContainer": { my: 0 },
                                    ".MuiPickerDay-root": { fontSize: 13, fontWeight: 600, fontFamily: "'Inter', sans-serif", width: 36, height: 36, borderRadius: "50%", transition: "all 150ms ease", "&:hover": { bgcolor: "hsl(240, 20%, 95%) !important" }, "&:not(.Mui-selected)": { borderColor: "transparent" } },
                                    ".MuiPickerDay-root.Mui-selected": { background: "#7c3aed !important", color: "#fff !important", fontWeight: 700 },
                                    ".MuiPickersDay-today:not(.Mui-selected)": { borderColor: "#7c3aed" },
                                    ".MuiYearCalendar-root": { maxHeight: 250, overflowY: "auto" },
                                    ".MuiYearCalendar-button": { fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", width: 72, height: 36, borderRadius: "8px", margin: "2px", color: "hsl(240, 15%, 15%)", "&:hover": { bgcolor: "hsl(240, 20%, 95%) !important" } },
                                    ".MuiYearCalendar-button.Mui-selected": { background: "#7c3aed !important", color: "#fff !important", fontWeight: 700 },
                                    ".MuiMonthCalendar-button": { fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", width: 72, height: 36, borderRadius: "8px", margin: "2px", color: "hsl(240, 15%, 15%)", "&:hover": { bgcolor: "hsl(240, 20%, 95%) !important" } },
                                    ".MuiMonthCalendar-button.Mui-selected": { background: "#7c3aed !important", color: "#fff !important", fontWeight: 700 },
                                    ".MuiPickersDay-hiddenDaySpacing": { display: "none" },
                                    ".MuiPickersLayout-actionBar": { display: "none" },
                                }}>
                                    <DateCalendar
                                        className="profile-page__date-calendar"
                                        value={dobValue ? dayjs(dobValue) : null}
                                        onChange={handleDobCalendarChange}
                                        views={["year", "month", "day"]}
                                        maxDate={dayjs()}
                                        disableFuture
                                    />
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Popper>

                    <Box className="profile-page__personal-actions" sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2.5 }}>
                        <Button
                            className="profile-page__cancel-btn"
                            onClick={handleCancelProfile}
                            disabled={profileLoading}
                            sx={{
                                fontSize: 13, fontWeight: 700, color: "hsl(240, 8%, 50%)", textTransform: "none",
                                borderRadius: "10px", px: 3, py: 1,
                                "&:hover": { bgcolor: "hsl(240, 20%, 95%)" },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="profile-page__save-btn"
                            variant="contained"
                            disabled={!hasProfileChanges || profileLoading}
                            onClick={handleSaveProfile}
                            startIcon={profileLoading ? <CircularProgress className="profile-page__save-spinner" size={16} color="inherit" /> : null}
                            sx={{
                                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                color: "#fff", px: 3, py: 1, fontSize: 13, fontWeight: 700,
                                borderRadius: "10px", textTransform: "none",
                                boxShadow: "0 2px 8px rgb(124, 58, 237 / .2)",
                                "&:hover": { background: "linear-gradient(135deg, #6d28d9, #9333ea)", boxShadow: "0 4px 12px rgb(124, 58, 237 / .3)" },
                                "&.Mui-disabled": { background: "hsl(240, 10%, 88%)", color: "hsl(240, 6%, 65%)", boxShadow: "none" },
                            }}
                        >
                            {profileLoading ? "Saving..." : "Save"}
                        </Button>
                    </Box>
                </Box>

                <Box className="profile-page__password-card" sx={{ ...cardSx, flex: 1, mb: 0 }}>
                    <Typography className="profile-page__password-heading" sx={headingSx}>
                        Change Password
                    </Typography>

                    <Typography className="profile-page__label" sx={labelSx}>Current Password</Typography>
                    <TextField
                        className="profile-page__current-password-input"
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
                                    <InputAdornment className="profile-page__current-password-adornment-start" position="start">
                                        <MdPassword className="profile-page__current-password-icon" size={18} style={{ color: "hsl(240, 10%, 40%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="profile-page__current-password-adornment-end" position="end">
                                        <IconButton className="profile-page__current-password-toggle" onClick={() => setShowCurrent((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 40%)", "&:hover": { color: "#7c3aed" } }}>
                                            {showCurrent ? <FaEyeSlash className="profile-page__eye-slash-icon" size={18} /> : <FaEye className="profile-page__eye-icon" size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Typography className="profile-page__label" sx={labelSx}>New Password</Typography>
                    <TextField
                        className="profile-page__new-password-input"
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
                                    <InputAdornment className="profile-page__new-password-adornment-start" position="start">
                                        <MdPassword className="profile-page__new-password-icon" size={18} style={{ color: "hsl(240, 10%, 40%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="profile-page__new-password-adornment-end" position="end">
                                        <IconButton className="profile-page__new-password-toggle" onClick={() => setShowNew((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 40%)", "&:hover": { color: "#7c3aed" } }}>
                                            {showNew ? <FaEyeSlash className="profile-page__eye-slash-icon" size={18} /> : <FaEye className="profile-page__eye-icon" size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Typography className="profile-page__label" sx={labelSx}>Confirm Password</Typography>
                    <TextField
                        className="profile-page__confirm-password-input"
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
                                    <InputAdornment className="profile-page__confirm-password-adornment-start" position="start">
                                        <MdPassword className="profile-page__confirm-password-icon" size={18} style={{ color: "hsl(240, 10%, 40%)" }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment className="profile-page__confirm-password-adornment-end" position="end">
                                        <IconButton className="profile-page__confirm-password-toggle" onClick={() => setShowConfirm((p) => !p)} edge="end" size="small" sx={{ color: "hsl(240, 10%, 40%)", "&:hover": { color: "#7c3aed" } }}>
                                            {showConfirm ? <FaEyeSlash className="profile-page__eye-slash-icon" size={18} /> : <FaEye className="profile-page__eye-icon" size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <Box className="profile-page__password-actions" sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}>
                        <Button
                            className="profile-page__update-password-btn"
                            variant="contained"
                            disabled={!hasPasswordChange || passwordLoading}
                            onClick={handleUpdatePassword}
                            startIcon={passwordLoading ? <CircularProgress className="profile-page__update-spinner" size={16} color="inherit" /> : null}
                            sx={{
                                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                                color: "#fff", px: 3, py: 1, fontSize: 13, fontWeight: 700,
                                borderRadius: "10px", textTransform: "none",
                                boxShadow: "0 2px 8px rgb(124, 58, 237 / .2)",
                                "&:hover": { background: "linear-gradient(135deg, #6d28d9, #9333ea)", boxShadow: "0 4px 12px rgb(124, 58, 237 / .3)" },
                                "&.Mui-disabled": { background: "hsl(240, 10%, 88%)", color: "hsl(240, 6%, 65%)", boxShadow: "none" },
                            }}
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ProfilePage;
