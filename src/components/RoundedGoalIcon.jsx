import { getIconOption } from "../utils/goals";

function RoundedGoalIcon({ iconKey, fallbackKey, sx = {}, style = {}, className = "", ...props }) {
    const option = getIconOption(iconKey, fallbackKey);

    const finalStyle = { ...style };

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

    if (sx.fontSize) {
        if (typeof sx.fontSize === "object") {
            const sizeVal = sx.fontSize.sm || sx.fontSize.xs || 20;
            finalStyle.fontSize = `${sizeVal}px`;
        } else {
            finalStyle.fontSize = typeof sx.fontSize === "number" ? `${sx.fontSize}px` : sx.fontSize;
        }
    }

    const Icon = option.Icon;
    return <Icon style={finalStyle} className={className} {...props} />;
}

export default RoundedGoalIcon;
