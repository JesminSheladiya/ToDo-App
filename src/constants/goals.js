import {
    PiTargetBold, PiLightningBold, PiTreeBold, PiRocketBold,
    PiStarBold, PiBarbellBold, PiBookOpenTextBold, PiLightbulbBold,
    PiTrophyBold, PiHeartBold, PiPaletteBold, PiPersonSimpleRunBold,
    PiAirplaneBold, PiPiggyBankBold, PiFlowerLotusBold, PiFireBold
} from "react-icons/pi";

export const ICON_OPTIONS = [
    { key: "target", label: "Target", Icon: PiTargetBold },
    { key: "flash", label: "Energy", Icon: PiLightningBold },
    { key: "growth", label: "Growth", Icon: PiTreeBold },
    { key: "launch", label: "Launch", Icon: PiRocketBold },
    { key: "star", label: "Star", Icon: PiStarBold },
    { key: "strength", label: "Strength", Icon: PiBarbellBold },
    { key: "learning", label: "Learning", Icon: PiBookOpenTextBold },
    { key: "idea", label: "Idea", Icon: PiLightbulbBold },
    { key: "achievement", label: "Achievement", Icon: PiTrophyBold },
    { key: "heart", label: "Heart", Icon: PiHeartBold },
    { key: "creative", label: "Creative", Icon: PiPaletteBold },
    { key: "fitness", label: "Fitness", Icon: PiPersonSimpleRunBold },
    { key: "travel", label: "Travel", Icon: PiAirplaneBold },
    { key: "money", label: "Money", Icon: PiPiggyBankBold },
    { key: "mindful", label: "Mindful", Icon: PiFlowerLotusBold },
    { key: "fire", label: "Momentum", Icon: PiFireBold }
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
