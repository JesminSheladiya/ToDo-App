import { 
    BsBullseye, BsLightningChargeFill, BsStarFill,
    BsBookHalf, BsLightbulbFill, BsTrophyFill, BsHeartFill,
    BsPaletteFill, BsAirplane, BsPiggyBankFill, BsFire, BsRocketTakeoffFill, BsTree
} from "react-icons/bs";
import { FaDumbbell, FaRunning, FaSpa } from "react-icons/fa";

export const ICON_OPTIONS = [
    { key: "target", label: "Target", Icon: BsBullseye },
    { key: "flash", label: "Energy", Icon: BsLightningChargeFill },
    { key: "growth", label: "Growth", Icon: BsTree },
    { key: "launch", label: "Launch", Icon: BsRocketTakeoffFill },
    { key: "star", label: "Star", Icon: BsStarFill },
    { key: "strength", label: "Strength", Icon: FaDumbbell },
    { key: "learning", label: "Learning", Icon: BsBookHalf },
    { key: "idea", label: "Idea", Icon: BsLightbulbFill },
    { key: "achievement", label: "Achievement", Icon: BsTrophyFill },
    { key: "heart", label: "Heart", Icon: BsHeartFill },
    { key: "creative", label: "Creative", Icon: BsPaletteFill },
    { key: "fitness", label: "Fitness", Icon: FaRunning },
    { key: "travel", label: "Travel", Icon: BsAirplane },
    { key: "money", label: "Money", Icon: BsPiggyBankFill },
    { key: "mindful", label: "Mindful", Icon: FaSpa },
    { key: "fire", label: "Momentum", Icon: BsFire }
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
