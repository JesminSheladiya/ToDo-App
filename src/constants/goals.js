import {
    faBullseye, faBolt, faTree, faRocket,
    faTrophy, faPalette, faPlane, faPiggyBank,
    faFire, faDumbbell, faPersonRunning, faSpa,
    faBookOpen
} from "@fortawesome/free-solid-svg-icons";
import {
    faStar, faLightbulb, faHeart
} from "@fortawesome/free-regular-svg-icons";

export const ICON_OPTIONS = [
    { key: "target", label: "Target", iconDef: faBullseye },
    { key: "flash", label: "Energy", iconDef: faBolt },
    { key: "growth", label: "Growth", iconDef: faTree },
    { key: "launch", label: "Launch", iconDef: faRocket },
    { key: "star", label: "Star", iconDef: faStar },
    { key: "strength", label: "Strength", iconDef: faDumbbell },
    { key: "learning", label: "Learning", iconDef: faBookOpen },
    { key: "idea", label: "Idea", iconDef: faLightbulb },
    { key: "achievement", label: "Achievement", iconDef: faTrophy },
    { key: "heart", label: "Heart", iconDef: faHeart },
    { key: "creative", label: "Creative", iconDef: faPalette },
    { key: "fitness", label: "Fitness", iconDef: faPersonRunning },
    { key: "travel", label: "Travel", iconDef: faPlane },
    { key: "money", label: "Money", iconDef: faPiggyBank },
    { key: "mindful", label: "Mindful", iconDef: faSpa },
    { key: "fire", label: "Momentum", iconDef: faFire }
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
