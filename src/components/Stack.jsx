const sxMap = {
    m: "margin", mt: "marginTop", mr: "marginRight", mb: "marginBottom", ml: "marginLeft",
    mx: "marginInline", my: "marginBlock",
    p: "padding", pt: "paddingTop", pr: "paddingRight", pb: "paddingBottom", pl: "paddingLeft",
    px: "paddingInline", py: "paddingBlock",
    bgcolor: "backgroundColor",
};

function resolveSx(sx) {
    if (!sx) return {};
    const out = {};
    for (const [key, val] of Object.entries(sx)) {
        if (key in sxMap) {
            out[sxMap[key]] = val;
        } else {
            out[key] = val;
        }
    }
    return out;
}

function Stack({
    direction = "vertical",
    spacing = 0,
    alignItems,
    justifyContent,
    flexWrap,
    sx,
    style,
    children,
    ...props
}) {
    const isRow = direction === "row";
    const gap = spacing ? `${spacing * 0.5}rem` : undefined;
    const resolved = resolveSx(sx);

    const combinedStyle = {
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: alignItems === "flex-start" ? "start" : alignItems === "flex-end" ? "end" : alignItems || undefined,
        justifyContent: justifyContent === "flex-start" ? "start" : justifyContent === "flex-end" ? "end" : justifyContent === "space-between" ? "space-between" : justifyContent || undefined,
        flexWrap: flexWrap ? "wrap" : undefined,
        gap,
        ...resolved,
        ...style,
    };

    Object.keys(combinedStyle).forEach((key) => {
        if (combinedStyle[key] === undefined || combinedStyle[key] === null) {
            delete combinedStyle[key];
        }
    });

    return (
        <div className="stack" style={combinedStyle} {...props}>
            {children}
        </div>
    );
}

export default Stack;
