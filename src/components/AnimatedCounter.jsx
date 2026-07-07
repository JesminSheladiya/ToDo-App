import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

function DotLoader({ sx }) {
    return (
        <Box
            component="span"
            sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                verticalAlign: "middle",
                ...sx,
            }}
        >
            {[0, 1, 2].map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        bgcolor: "hsl(240, 8%, 60%)",
                        animation: "dotBounce 1s infinite ease-in-out",
                        animationDelay: `${i * 0.15}s`,
                        "@keyframes dotBounce": {
                            "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.4 },
                            "40%": { transform: "scale(1)", opacity: 1 },
                        },
                    }}
                />
            ))}
        </Box>
    );
}

function AnimatedCounter({ value = 0, loading = false, duration = 1200, prefix = "", suffix = "", sx, className }) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef(null);
    const startRef = useRef(null);
    const fromRef = useRef(0);

    useEffect(() => {
        if (loading) return;

        const target = Number(value) || 0;
        const from = fromRef.current;
        if (from === target) return;

        const start = performance.now();
        startRef.current = start;

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(from + (target - from) * eased);
            setDisplay(current);
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                fromRef.current = target;
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [value, loading, duration]);

    useEffect(() => {
        if (loading) {
            fromRef.current = 0;
            setDisplay(0);
        }
    }, [loading]);

    if (loading) {
        return (
            <Box
                className={className}
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle", ...sx }}
            >
                <DotLoader />
            </Box>
        );
    }

    return (
        <Typography
            component="span"
            className={className}
            sx={{ display: "inline-block", verticalAlign: "middle", ...sx }}
        >
            {prefix}{display}{suffix}
        </Typography>
    );
}

export default AnimatedCounter;
