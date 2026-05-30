import { Typography } from "@mui/material";

function Stat({ label, value, color }) {
    return (
        <div style={{
            flex: "1",
            textAlign: "center",
            padding: "4px 8px",
        }}>
            <Typography sx={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 800,
                fontSize: 24,
                color,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
            }}>
                {value}
            </Typography>
            <Typography sx={{
                fontSize: 11,
                color: "hsl(240, 8%, 50%)",
                fontWeight: 600,
                mt: 0.25,
            }}>
                {label}
            </Typography>
        </div>
    );
}

export default Stat;
