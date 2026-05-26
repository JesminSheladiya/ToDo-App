import { ICON_OPTIONS, LEGACY_ICON_MAP, CATEGORIES } from "../constants/goals";

export function getCategory(categoryKey) {
    return CATEGORIES.find((category) => category.key === categoryKey) || CATEGORIES[0];
}

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

export function createId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function normalizeGoal(goal) {
    const category = getCategory(goal.category);
    const steps = Array.isArray(goal.steps)
        ? goal.steps.map((step) => ({
            stepId: step.stepId || step.id || createId(),
            text: step.text || "",
            done: Boolean(step.done)
        }))
        : [];
    const completed = Boolean(goal.completed || goal.status === "completed");

    return {
        ...goal,
        category: category.key,
        emoji: getIconKey(goal.emoji, category.iconKey),
        targetDate: goal.targetDate || "",
        steps,
        status: completed ? "completed" : (goal.status || "active"),
        completed
    };
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

export function syncCompletion(goal) {
    const steps = goal.steps || [];
    const completed = steps.length > 0
        ? steps.every((step) => step.done)
        : Boolean(goal.completed || goal.status === "completed");

    return {
        ...goal,
        completed,
        status: completed ? "completed" : "active"
    };
}
