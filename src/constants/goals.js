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
