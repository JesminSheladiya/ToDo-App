import {
    TrackChangesRounded, FlashOnRounded, SpaRounded,
    RocketLaunchRounded, StarRounded, FitnessCenterRounded,
    MenuBookRounded, LightbulbRounded, EmojiEventsRounded,
    FavoriteRounded, PaletteRounded, DirectionsRunRounded,
    FlightTakeoffRounded, SavingsRounded, SelfImprovementRounded,
    LocalFireDepartmentRounded
} from "@mui/icons-material";

export const ICON_OPTIONS = [
    { key: "target", label: "Target", Icon: TrackChangesRounded },
    { key: "flash", label: "Energy", Icon: FlashOnRounded },
    { key: "growth", label: "Growth", Icon: SpaRounded },
    { key: "launch", label: "Launch", Icon: RocketLaunchRounded },
    { key: "star", label: "Star", Icon: StarRounded },
    { key: "strength", label: "Strength", Icon: FitnessCenterRounded },
    { key: "learning", label: "Learning", Icon: MenuBookRounded },
    { key: "idea", label: "Idea", Icon: LightbulbRounded },
    { key: "achievement", label: "Achievement", Icon: EmojiEventsRounded },
    { key: "heart", label: "Heart", Icon: FavoriteRounded },
    { key: "creative", label: "Creative", Icon: PaletteRounded },
    { key: "fitness", label: "Fitness", Icon: DirectionsRunRounded },
    { key: "travel", label: "Travel", Icon: FlightTakeoffRounded },
    { key: "money", label: "Money", Icon: SavingsRounded },
    { key: "mindful", label: "Mindful", Icon: SelfImprovementRounded },
    { key: "fire", label: "Momentum", Icon: LocalFireDepartmentRounded }
];

export const LEGACY_ICON_MAP = {
    "\uD83C\uDFAF": "target",
    "\u26A1": "flash",
    "\uD83C\uDF31": "growth",
    "\uD83D\uDE80": "launch",
    "\u2B50": "star",
    "\uD83D\uDCAA": "strength",
    "\uD83D\uDCDA": "learning",
    "\uD83D\uDCA1": "idea",
    "\uD83C\uDFC6": "achievement",
    "\u2764\uFE0F": "heart",
    "\uD83C\uDFA8": "creative",
    "\uD83C\uDFC3": "fitness",
    "\u2708\uFE0F": "travel",
    "\uD83D\uDCB0": "money",
    "\uD83E\uDDD8": "mindful",
    "\uD83D\uDD25": "fire"
};

export const CATEGORIES = [
    {
        key: "short_term",
        label: "Short Term",
        sublabel: "Days to weeks",
        iconKey: "flash",
        gradient: "linear-gradient(135deg, #fb923c, #f87171)",
        soft: "#fff7ed",
        border: "#fed7aa",
        badgeBg: "#ffedd5",
        text: "#ea580c",
        progress: "#fb923c"
    },
    {
        key: "mid_term",
        label: "Mid Term",
        sublabel: "Weeks to months",
        iconKey: "target",
        gradient: "linear-gradient(135deg, #facc15, #f59e0b)",
        soft: "#fefce8",
        border: "#fef08a",
        badgeBg: "#fef3c7",
        text: "#ca8a04",
        progress: "#facc15"
    },
    {
        key: "long_term",
        label: "Long Term",
        sublabel: "6 months to 1 year",
        iconKey: "growth",
        gradient: "linear-gradient(135deg, #4ade80, #10b981)",
        soft: "#f0fdf4",
        border: "#bbf7d0",
        badgeBg: "#dcfce7",
        text: "#16a34a",
        progress: "#4ade80"
    },
    {
        key: "very_long_term",
        label: "Very Long Term",
        sublabel: "1 to 5 years",
        iconKey: "launch",
        gradient: "linear-gradient(135deg, #60a5fa, #6366f1)",
        soft: "#eff6ff",
        border: "#bfdbfe",
        badgeBg: "#dbeafe",
        text: "#2563eb",
        progress: "#60a5fa"
    },
    {
        key: "life_goal",
        label: "Life Goal",
        sublabel: "5+ years / lifetime",
        iconKey: "star",
        gradient: "linear-gradient(135deg, #c084fc, #ec4899)",
        soft: "#faf5ff",
        border: "#e9d5ff",
        badgeBg: "#f3e8ff",
        text: "#9333ea",
        progress: "#a855f7"
    }
];

export const emptyDraft = {
    title: "",
    description: "",
    category: "short_term",
    targetDate: "",
    emoji: "target",
    steps: [],
    status: "active",
    completed: false
};
