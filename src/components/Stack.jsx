import { Stack as MuiStack } from "@mui/material";

function Stack({ alignItems, flexWrap, justifyContent, sx, ...props }) {
    return (
        <MuiStack
            {...props}
            sx={{
                ...(alignItems ? { alignItems } : {}),
                ...(flexWrap ? { flexWrap } : {}),
                ...(justifyContent ? { justifyContent } : {}),
                ...sx
            }}
        />
    );
}

export default Stack;
