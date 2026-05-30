import { getIconOption } from "../utils/goals";

function RoundedGoalIcon({ iconKey, fallbackKey, sx = {}, style = {}, className = "", ...props }) {
    const Icon = getIconOption(iconKey, fallbackKey).Icon;

    // Convert MUI style properties (sx) to React inline style
    const finalStyle = { ...style };

    // Resolve colors
    if (sx.color) {
        if (sx.color === "primary.main") {
            finalStyle.color = "#7c3aed";
        } else if (sx.color === "text.secondary") {
            finalStyle.color = "#71717a";
        } else if (sx.color === "text.primary") {
            finalStyle.color = "#18181b";
        } else if (sx.color === "text.disabled") {
            finalStyle.color = "#a1a1aa";
        } else {
            finalStyle.color = sx.color;
        }
    }

    if (sx.flexShrink !== undefined) {
        finalStyle.flexShrink = sx.flexShrink;
    }

    // Resolve font size (React Icons scale with style.fontSize)
    if (sx.fontSize) {
        if (typeof sx.fontSize === "object") {
            // Pick sm size or default
            const sizeVal = sx.fontSize.sm || sx.fontSize.xs || 20;
            finalStyle.fontSize = `${sizeVal}px`;
        } else {
            finalStyle.fontSize = typeof sx.fontSize === "number" ? `${sx.fontSize}px` : sx.fontSize;
        }
    }

    return <Icon style={finalStyle} className={className} {...props} />;
}

export default RoundedGoalIcon;
