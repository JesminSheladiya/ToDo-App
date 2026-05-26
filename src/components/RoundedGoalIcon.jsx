import { getIconOption } from "../utils/goals";

function RoundedGoalIcon({ iconKey, fallbackKey, sx }) {
    const Icon = getIconOption(iconKey, fallbackKey).Icon;

    return <Icon sx={sx} />;
}

export default RoundedGoalIcon;
