import { Box, Skeleton } from "@mui/material";

function StatBoxSkeleton() {
    return (
        <Box className="dashboard-skeleton__stat-box" sx={{
            bgcolor: "hsl(240, 20%, 97%)",
            borderRadius: "10px",
            py: 1.5,
            textAlign: "center",
        }}>
            <Skeleton className="dashboard-skeleton__stat-value" variant="text" width={40} height={32} sx={{ mx: "auto", mb: 0.5 }} />
            <Skeleton className="dashboard-skeleton__stat-label" variant="text" width={52} height={14} sx={{ mx: "auto" }} />
        </Box>
    );
}

function ProgressSummarySkeleton() {
    return (
        <Box className="dashboard-skeleton__progress-summary" sx={{
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid hsl(240, 10%, 90%)",
            overflow: "hidden",
        }}>
            <Box className="dashboard-skeleton__progress-accent" sx={{ height: 3, bgcolor: "hsl(240, 10%, 92%)" }} />
            <Box className="dashboard-skeleton__progress-body" sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Box className="dashboard-skeleton__progress-header" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Skeleton className="dashboard-skeleton__progress-title" variant="text" width={140} height={22} />
                    <Skeleton className="dashboard-skeleton__progress-count" variant="rounded" width={48} height={26} sx={{ borderRadius: "8px" }} />
                </Box>
                <Skeleton className="dashboard-skeleton__progress-track" variant="rounded" width="100%" height={8} sx={{ borderRadius: 99, mb: 0.75 }} />
                <Box className="dashboard-skeleton__progress-stats" sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Skeleton className="dashboard-skeleton__progress-label" variant="text" width={110} height={16} />
                    <Skeleton className="dashboard-skeleton__progress-value" variant="text" width={80} height={16} />
                </Box>
                <Box className="dashboard-skeleton__progress-tags" sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="dashboard-skeleton__tag" variant="rounded" width={76} height={28} sx={{ borderRadius: "8px" }} />
                    ))}
                </Box>
                <Box className="dashboard-skeleton__stat-grid" sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1 }}>
                    <StatBoxSkeleton />
                    <StatBoxSkeleton />
                    <StatBoxSkeleton />
                    <StatBoxSkeleton />
                </Box>
            </Box>
        </Box>
    );
}

function CategoryCardSkeleton() {
    return (
        <Box className="dashboard-skeleton__category-card" sx={{
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid hsl(240, 10%, 90%)",
            overflow: "hidden",
        }}>
            <Box className="dashboard-skeleton__category-accent" sx={{ height: 3, bgcolor: "hsl(240, 10%, 92%)" }} />
            <Box className="dashboard-skeleton__category-header" sx={{ display: "flex", alignItems: "center", gap: 1.5, px: { xs: 2, sm: 2.5 }, py: 1.5 }}>
                <Skeleton className="dashboard-skeleton__category-icon" variant="rounded" width={40} height={40} sx={{ borderRadius: "12px", flexShrink: 0 }} />
                <Box className="dashboard-skeleton__category-info" sx={{ flex: 1, minWidth: 0 }}>
                    <Skeleton className="dashboard-skeleton__category-title" variant="text" width={120} height={20} />
                    <Skeleton className="dashboard-skeleton__category-subtitle" variant="text" width={80} height={16} />
                </Box>
                <Box className="dashboard-skeleton__category-meta" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Skeleton className="dashboard-skeleton__category-progress" variant="rounded" width={100} height={6} sx={{ borderRadius: 99 }} />
                    <Skeleton className="dashboard-skeleton__category-count" variant="rounded" width={48} height={24} sx={{ borderRadius: "8px" }} />
                </Box>
            </Box>
            <Box className="dashboard-skeleton__category-goals" sx={{ borderTop: "1px solid hsl(240, 10%, 90%)" }}>
                {[1, 2, 3].map((i) => (
                    <Box key={i} className="dashboard-skeleton__goal-row" sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: { xs: 2, sm: 2.5 },
                        py: 1.25,
                        borderBottom: i < 3 ? "1px solid hsl(240, 10%, 90%)" : undefined,
                    }}>
                        <Skeleton className="dashboard-skeleton__goal-icon" variant="rounded" width={32} height={32} sx={{ borderRadius: "8px", flexShrink: 0 }} />
                        <Box className="dashboard-skeleton__goal-info" sx={{ flex: 1, minWidth: 0 }}>
                            <Skeleton className="dashboard-skeleton__goal-title" variant="text" width="60%" height={16} />
                            <Box className="dashboard-skeleton__goal-progress" sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Skeleton className="dashboard-skeleton__goal-bar" variant="rounded" width="100%" height={4} sx={{ borderRadius: 99 }} />
                                <Skeleton className="dashboard-skeleton__goal-percent" variant="text" width={24} height={12} />
                            </Box>
                        </Box>
                        <Skeleton className="dashboard-skeleton__goal-status" variant="rounded" width={48} height={24} sx={{ borderRadius: "6px" }} />
                    </Box>
                ))}
            </Box>
            <Box className="dashboard-skeleton__category-footer" sx={{ px: { xs: 2, sm: 2.5 }, py: 1, borderTop: "1px solid hsl(240, 10%, 90%)", bgcolor: "hsl(240, 20%, 99%)" }}>
                <Skeleton className="dashboard-skeleton__footer-text" variant="text" width={72} height={16} />
            </Box>
        </Box>
    );
}

function DashboardSkeleton({ className }) {
    return (
        <Box className={`dashboard-skeleton__container${className ? ` ${className}` : ""}`} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <CategoryCardSkeleton />
            <CategoryCardSkeleton />
        </Box>
    );
}

export default DashboardSkeleton;
