import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteAccount } from "../store/authSlice";
import {
    Box, Button, Dialog, IconButton,
    TextField, Typography,
} from "@mui/material";
import { MdArrowBack } from "react-icons/md";
import { FiMail, FiDownload, FiTrash } from "react-icons/fi";
import { IoCalendarNumberOutline, IoTimeOutline } from "react-icons/io5";
import dayjs from "dayjs";

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

function AccountPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const goals = useSelector((state) => state.goals.items);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== "delete") return;
        setDeleteLoading(true);
        const result = await dispatch(deleteAccount());
        if (deleteAccount.fulfilled.match(result)) {
            toast.success("Account deleted successfully");
            navigate("/login");
        } else {
            toast.error(result.payload || "Failed to delete account");
        }
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
    };

    return (
        <Box className="account-page__container" sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
            <Box className="account-page__top-bar" sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2.5,
            }}>
                <Box className="account-page__top-bar-left" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                        className="account-page__back-btn"
                        onClick={() => navigate(-1)}
                        size="small"
                        sx={{
                            color: "hsl(240, 15%, 10%)",
                            "&:hover": { bgcolor: "hsl(240, 20%, 96%)" },
                        }}
                    >
                        <MdArrowBack className="account-page__back-icon" sx={{ fontSize: 22 }} />
                    </IconButton>
                    <Typography className="account-page__title" sx={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: 20, sm: 24 },
                        color: "hsl(240, 15%, 10%)",
                        letterSpacing: "-0.03em",
                    }}>
                        Account
                    </Typography>
                </Box>
            </Box>

            <Box className="account-page__details-card" sx={{
                ...cardSx,
                overflow: "hidden",
                p: 0,
            }}>
                <Box className="account-page__details-accent" sx={{
                    height: 4,
                    background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
                }} />
                <Box className="account-page__details-content" sx={{ p: { xs: 2.5, sm: 3 } }}>
                    <Typography className="account-page__details-heading" sx={headingSx}>
                        Account Details
                    </Typography>
                    <Box className="account-page__details-grid" sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                        <Box className="account-page__detail-item" sx={{ maxWidth: '100%' }}>
                            <Typography className="account-page__detail-label" sx={{ fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)", textTransform: "capitalize", mb: 1 }}>
                                Email
                            </Typography>
                            <Box className="account-page__detail-value" sx={{
                                display: "inline-flex", alignItems: "center", gap: 1,
                                bgcolor: "hsl(240, 20%, 98%)", borderRadius: "8px",
                                px: 1.25, py: 0.75, maxWidth: "100%"
                            }}>
                                <FiMail size={18} color="hsl(240, 8%, 45%)" />
                                <Typography className="account-page__detail-text" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {user?.email || "—"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="account-page__detail-item">
                            <Typography className="account-page__detail-label" sx={{ fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)", textTransform: "capitalize", mb: 1 }}>
                                Account Created
                            </Typography>
                            <Box className="account-page__detail-value" sx={{
                                display: "inline-flex", alignItems: "center", gap: 1,
                                bgcolor: "hsl(240, 20%, 98%)", borderRadius: "8px",
                                px: 1.25, py: 0.75,
                            }}>
                                <IoCalendarNumberOutline size={18} color="hsl(240, 8%, 45%)" />
                                <Typography className="account-page__detail-text" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)" }}>
                                    {user?.createdAt ? dayjs(user.createdAt).format("DD MMM, YYYY") : "—"}
                                </Typography>
                            </Box>
                        </Box>
                        <Box className="account-page__detail-item">
                            <Typography className="account-page__detail-label" sx={{ fontSize: 13, fontWeight: 600, color: "hsl(240, 8%, 40%)", textTransform: "capitalize", mb: 1 }}>
                                Last Login
                            </Typography>
                            <Box className="account-page__detail-value" sx={{
                                display: "inline-flex", alignItems: "center", gap: 1,
                                bgcolor: "hsl(240, 20%, 98%)", borderRadius: "8px",
                                px: 1.25, py: 0.75,
                            }}>
                                <IoCalendarNumberOutline size={18} color="hsl(240, 8%, 45%)" />
                                <Typography className="account-page__detail-text" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)" }}>
                                    {user?.lastLogin ? dayjs(user.lastLogin).format("DD MMM, YYYY") : "—"}
                                </Typography>
                                {user?.lastLogin && (
                                    <>
                                        <Box className="account-page__detail-separator" sx={{ width: "1px", height: 16, bgcolor: "hsl(240, 10%, 85%)" }} />
                                        <IoTimeOutline size={18} color="hsl(240, 8%, 45%)" />
                                        <Typography className="account-page__detail-text" sx={{ fontSize: 14, fontWeight: 600, color: "hsl(240, 15%, 15%)" }}>
                                            {dayjs(user.lastLogin).format("hh:mm A")}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className="account-page__export-card" sx={cardSx}>
                <Box className="account-page__export-content" sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box className="account-page__export-text">
                        <Typography className="account-page__export-heading" sx={headingSx}>
                            Export Data
                        </Typography>
                        <Typography className="account-page__export-description" sx={{
                            fontSize: 13,
                            color: "hsl(240, 8%, 45%)",
                            fontWeight: 500,
                            lineHeight: 1.5,
                        }}>
                            Download all your goals and progress as a JSON file.
                        </Typography>
                    </Box>
                    <Button
                        className="account-page__export-btn"
                        variant="outlined"
                        onClick={() => {
                            const data = { exportedAt: new Date().toISOString(), goals };
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `goals-export-${new Date().toISOString().slice(0, 10)}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                            toast.success("Goals exported successfully");
                        }}
                        startIcon={<FiDownload className="account-page__export-icon" size={16} />}
                        sx={{
                            borderColor: "hsl(240, 10%, 80%)",
                            color: "hsl(240, 15%, 20%)",
                            fontSize: 13,
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: "10px",
                            px: 3,
                            py: 1,
                            flexShrink: 0,
                            "&:hover": {
                                borderColor: "#7c3aed",
                                color: "#7c3aed",
                                bgcolor: "hsl(262, 83%, 96%)",
                            },
                        }}
                    >
                        Export JSON
                    </Button>
                </Box>
            </Box>

            <Box className="account-page__danger-card" sx={{
                ...cardSx,
                borderColor: "hsl(0, 70%, 85%)",
                bgcolor: "hsl(0, 60%, 98%)",
            }}>
                <Typography className="account-page__danger-heading" sx={{
                    ...headingSx,
                    color: "#dc2626",
                }}>
                    Danger Zone
                </Typography>
                <Typography className="account-page__danger-description" sx={{
                    fontSize: 13,
                    color: "hsl(0, 50%, 40%)",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    mb: 2,
                }}>
                    Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button
                    className="account-page__delete-btn"
                    variant="contained"
                    onClick={() => setDeleteDialogOpen(true)}
                    startIcon={<FiTrash className="account-page__delete-icon" size={16} />}
                    sx={{
                        bgcolor: "#dc2626",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        textTransform: "none",
                        borderRadius: "10px",
                        px: 3,
                        py: 1,
                        "&:hover": { bgcolor: "#b91c1c" },
                    }}
                >
                    Delete Account
                </Button>
            </Box>

            <Dialog
                className="account-page__delete-dialog"
                open={deleteDialogOpen}
                onClose={() => { if (!deleteLoading) setDeleteDialogOpen(false); }}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: "14px",
                            maxWidth: 400,
                            p: 3,
                        }
                    }
                }}
            >
                <Typography className="account-page__delete-dialog-title" sx={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: 18,
                    color: "#dc2626",
                    mb: 1,
                }}>
                    Delete Account
                </Typography>
                <Typography className="account-page__delete-dialog-description" sx={{
                    fontSize: 13,
                    color: "hsl(240, 8%, 45%)",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    mb: 2.5,
                }}>
                    This will permanently delete your account and all associated data. Type <strong>delete</strong> to confirm.
                </Typography>
                <TextField
                    className="account-page__delete-confirm-input"
                    fullWidth
                    placeholder='Type "delete" to confirm'
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{
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
                                borderColor: "#dc2626",
                                borderWidth: 1.5,
                            },
                        },
                    }}
                />
                <Box className="account-page__delete-dialog-actions" sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2.5,
                }}>
                    <Button
                        className="account-page__delete-cancel-btn"
                        onClick={() => { setDeleteDialogOpen(false); setDeleteConfirmText(""); }}
                        disabled={deleteLoading}
                        sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "hsl(240, 8%, 50%)",
                            textTransform: "none",
                            borderRadius: "10px",
                            px: 3,
                            py: 1,
                            "&:hover": { bgcolor: "hsl(240, 20%, 95%)" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="account-page__delete-confirm-btn"
                        variant="contained"
                        disabled={deleteConfirmText !== "delete" || deleteLoading}
                        onClick={handleDeleteAccount}
                        sx={{
                            bgcolor: "#dc2626",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: "10px",
                            px: 3,
                            py: 1,
                            "&:hover": { bgcolor: "#b91c1c" },
                            "&.Mui-disabled": { bgcolor: "hsl(240, 10%, 88%)", color: "hsl(240, 6%, 65%)" },
                        }}
                    >
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}

export default AccountPage;
