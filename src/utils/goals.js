import { ICON_OPTIONS, LEGACY_ICON_MAP } from "../constants/goals";

export function getIconKey(iconKey, fallbackKey = "target") {
    const normalizedKey = LEGACY_ICON_MAP[iconKey] || iconKey;

    return ICON_OPTIONS.some((option) => option.key === normalizedKey)
        ? normalizedKey
        : fallbackKey;
}

export function getIconOption(iconKey, fallbackKey = "target") {
    const normalizedKey = getIconKey(iconKey, fallbackKey);

    return ICON_OPTIONS.find((option) => option.key === normalizedKey) || ICON_OPTIONS[0];
}

export function getStepProgress(goal) {
    const steps = goal.steps || [];

    if (steps.length === 0) {
        return goal.completed ? 100 : 0;
    }

    return Math.round((steps.filter((step) => step.done).length / steps.length) * 100);
}

export function formatDate(value) {
    if (!value) return "";

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(`${value}T00:00:00`));
}
