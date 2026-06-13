import { Box, Button, CircularProgress, Dialog } from "@mui/material";

export default function ConfirmDeleteDialog({
    open,
    onClose,
    onConfirm,
    message,
    confirmLabel = "Delete",
    loading = false,
    error = null,
}) {
    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        maxWidth: 300,
                    }
                }
            }}
        >
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
                {message && (
                    <Box sx={{ fontSize: 15, fontFamily: "Sora", color: "hsl(240, 8%, 45%)", lineHeight: 1.5, wordWrap: "break-word" }}>
                        {message}
                    </Box>
                )}
                {error && (
                    <Box sx={{ fontSize: 15, fontFamily: "Sora", color: "#dc2626", mt: 1, fontWeight: 500, wordWrap: "break-word" }}>
                        {error}
                    </Box>
                )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, px: 2.5, pb: 2.5 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    size="small"
                    sx={{
                        fontSize: 13, fontWeight: 600, textTransform: "none",
                        color: "hsl(240, 8%, 50%)", minWidth: 60, borderRadius: "8px", boxShadow: "1px 1px 2px 1px #00000020"
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    size="small"
                    sx={{
                        fontSize: 13, fontWeight: 600, textTransform: "none",
                        bgcolor: "#ef4444", color: "#fff", minWidth: 60, borderRadius: "8px",
                        "&:hover": { bgcolor: "#dc2626" },
                        "&.Mui-disabled": { bgcolor: "#fca5a5", color: "#fff" },
                    }}
                >
                    {loading ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : confirmLabel}
                </Button>
            </Box>
        </Dialog>
    );
}
