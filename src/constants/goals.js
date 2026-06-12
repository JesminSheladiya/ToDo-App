import { PiBarbellFill } from "react-icons/pi";
import { GoGoal } from "react-icons/go";
import { BsLightningChargeFill , BsFillRocketTakeoffFill , BsFillTrophyFill } from "react-icons/bs";
import { FaStar , FaHeart , FaPersonRunning, FaMoneyBillWave, FaBrain, FaFire, FaSeedling } from "react-icons/fa6";
import { MdMenuBook } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";
import { IoAirplane, IoColorPalette } from "react-icons/io5";

export const ICON_OPTIONS = [
    { key: "target", label: "Target", Icon: GoGoal },
    { key: "flash", label: "Energy", Icon: BsLightningChargeFill },
    { key: "growth", label: "Growth", Icon: FaSeedling },
    { key: "launch", label: "Launch", Icon: BsFillRocketTakeoffFill },
    { key: "star", label: "Star", Icon: FaStar },
    { key: "strength", label: "Strength", Icon: PiBarbellFill },
    { key: "learning", label: "Learning", Icon: MdMenuBook },
    { key: "idea", label: "Idea", Icon: FaLightbulb },
    { key: "achievement", label: "Achievement", Icon: BsFillTrophyFill },
    { key: "heart", label: "Heart", Icon: FaHeart },
    { key: "creative", label: "Creative", Icon: IoColorPalette },
    { key: "fitness", label: "Fitness", Icon: FaPersonRunning },
    { key: "travel", label: "Travel", Icon: IoAirplane },
    { key: "money", label: "Money", Icon: FaMoneyBillWave },
    { key: "mindful", label: "Mindful", Icon: FaBrain },
    { key: "fire", label: "Momentum", Icon: FaFire }
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
    targetTime: "",
    emoji: "target",
    steps: [],
    status: "active",
    completed: false
};
