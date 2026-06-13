import { useCallback, useEffect, useRef, useState } from "react";
import {
    Box, Button, ClickAwayListener, Paper, Popper,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { IoCalendarNumber } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";

const ACCENT_FALLBACK = "#7c3aed";
const SOFT_FALLBACK = "#f5f3ff";

const TIME_TAB_SX = {
    px: 1,
    ".MuiTimeClock-root": {
        width: "100%",
        height: "100%",
        transform: "scale(0.9)",
        transformOrigin: "center center",
        margin: "0 auto",
        overflow: "visible !important",
    },
    ".MuiPickersLayout-root": {
        flexDirection: "column",
        minWidth: "auto",
        overflow: "visible !important",
    },
    ".MuiPickersLayout-contentWrapper": {
        overflow: "visible !important",
    },
    ".MuiDateCalendar-viewTransitionContainer": {
        overflow: "visible !important",
    },
    ".MuiPickersClock-squareMask": {
        borderRadius: "50%",
    },
    ".MuiPickersClock-hand": {
        backgroundColor: ACCENT_FALLBACK,
        height: "calc(50% - 20px)",
    },
    ".MuiClock-root": {
        m: "0",
    },
    ".MuiClockPointer-root": {
        background: `${ACCENT_FALLBACK} !important`,
    },
    ".MuiClockPointer-thumb": {
        background: `${ACCENT_FALLBACK} !important`,
        border: "2px solid transparent",
        width: 30,
        height: 30,
        top: "-20px",
        left: "calc(50% - 17px)",
    },
    ".MuiClock-pin": {
        backgroundColor: ACCENT_FALLBACK,
        width: 4,
        height: 4,
    },
    ".MuiPickersClock-center": {
        backgroundColor: ACCENT_FALLBACK,
        width: 8,
        height: 8,
    },
    ".MuiPickersClockNumber-root": {
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        color: "hsl(240, 15%, 20%)",
    },
    ".MuiPickersClockNumber-root.Mui-selected": {
        background: `${ACCENT_FALLBACK} !important`,
        color: "#fff !important",
        fontWeight: 700,
        width: 30,
        height: 30,
        borderRadius: "50%",
    },
    ".MuiPickersClockNumber-label": {
        transform: "none",
    },
    ".MuiPickersArrowSwitcher-root": {
        display: "none",
    },
    ".MuiPickersToolbar-content": {
        px: 1.5,
        py: 0.5,
        justifyContent: "center",
        gap: 0,
    },
    ".MuiTimeClockToolbarContent": {
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 0,
    },
    ".MuiPickersToolbar-text": {
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700,
        fontSize: 30,
        lineHeight: 1,
        color: "hsl(240, 15%, 10%)",
        opacity: 0.3,
        transition: "all 150ms ease",
        border: "none",
        background: "none",
        padding: 0,
        margin: 0,
        cursor: "pointer",
    },
    ".MuiTimePickerToolbar-ampmLabel[data-selected]": {
        padding: "0 8px",
        backgroundColor: SOFT_FALLBACK,
        color: ACCENT_FALLBACK,
        borderRadius: "6px",
        opacity: 1,
    },
    ".MuiPickersToolbarSeparator": {
        mx: 0.15,
        fontWeight: 700,
        fontSize: 30,
        lineHeight: 1,
        fontFamily: "'Sora', sans-serif",
        color: "hsl(240, 8%, 70%)",
    },
    ".MuiPickersToolbarButton-root": {
        padding: "2px 4px",
        margin: 0,
        borderRadius: "6px",
        minWidth: "auto",
        "&:hover": {
            bgcolor: "hsl(240, 20%, 95%)",
        },
    },
    ".MuiClock-amButton, .MuiClock-pmButton": {
        display: "none",
    },
    ".MuiPickersLayout-actionBar": {
        display: "none",
    },
    ".MuiPickersToolbar-root": {
        minHeight: "auto",
        py: 0,
    },
    ".MuiPickersToolbar-title": {
        display: "none",
    },
};

export default function CustomDateTimePicker({
    value = { date: "", time: "" },
    onChange,
    accentTextColor = ACCENT_FALLBACK,
    accentColor = ACCENT_FALLBACK,
    gradientColor,
    softColor = SOFT_FALLBACK,
    label = "Target Date & Time",
}) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("date");
    const [localTime, setLocalTime] = useState(value.time || "");
    const anchorRef = useRef(null);
    const displayRef = useRef(null);
    const localTimeRef = useRef(localTime);
    const valueRef = useRef(value);
    const timePickerBoxRef = useRef(null);
    localTimeRef.current = localTime;
    valueRef.current = value;

    useEffect(() => {
        if (!open) {
            setLocalTime(value.time || "");
            localTimeRef.current = value.time || "";
        }
    }, [open, value.time]);

    const hasValue = !!(value.date || localTimeRef.current);

    const effectiveTime = localTimeRef.current || value.time || "";
    const displayText = (() => {
        const dateStr = value.date || (effectiveTime ? dayjs().format("YYYY-MM-DD") : "");
        if (!dateStr) return "DD/MM/YYYY hh:mm A";
        const d = dayjs(dateStr);
        if (effectiveTime) {
            const t = dayjs(effectiveTime, "HH:mm");
            return `${d.format("DD/MM/YYYY")} ${t.format("hh:mm A")}`;
        }
        return d.format("DD/MM/YYYY");
    })();

    const handleDateChange = useCallback((newDate) => {
        if (newDate && newDate.isValid()) {
            const dateStr = newDate.format("YYYY-MM-DD");
            onChange({ date: dateStr, time: valueRef.current.time || "" });
        }
    }, [onChange]);

    const handleTimeChange = useCallback((newTime) => {
        if (newTime && newTime.isValid()) {
            const timeStr = newTime.format("HH:mm");
            setLocalTime(timeStr);
            localTimeRef.current = timeStr;
            onChange({ date: valueRef.current.date || dayjs().format("YYYY-MM-DD"), time: timeStr });
        }
    }, [onChange]);

    const interceptedViewRenderer = useCallback((viewProps) => {
        const { onChange: originalOnChange, ...rest } = viewProps;
        const wrapped = (newValue, selectionState, selectedView) => {
            if (newValue && newValue.isValid()) {
                const timeStr = newValue.format("HH:mm");
                localTimeRef.current = timeStr;
                const el = displayRef.current;
                if (el) {
                    const v = valueRef.current;
                    const d = dayjs(v.date || dayjs().format("YYYY-MM-DD"));
                    const t = dayjs(timeStr, "HH:mm");
                    el.textContent = `${d.format("DD/MM/YYYY")} ${t.format("hh:mm A")}`;
                }
                const box = timePickerBoxRef.current;
                if (box) {
                    const btns = box.querySelectorAll('.MuiTimePickerToolbar-hourMinuteLabel button .MuiPickersToolbarText-root');
                    if (btns.length >= 2) {
                        btns[0].textContent = newValue.format('h');
                        btns[1].textContent = newValue.format('mm');
                    }
                }
            }
            originalOnChange(newValue, selectionState, selectedView);
        };
        return renderTimeViewClock({ ...rest, onChange: wrapped });
    }, []);

    const handleClear = useCallback((e) => {
        e.stopPropagation();
        onChange({ date: "", time: "" });
        setLocalTime("");
        localTimeRef.current = "";
        setOpen(false);
    }, [onChange]);

    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);

    const handleOK = useCallback(() => {
        setOpen(false);
    }, []);

    const handleToggle = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    const calendarValue = value.date ? dayjs(value.date) : null;
    const clockValue = value.date && value.time
        ? dayjs(`${value.date}T${value.time}`)
        : value.date
            ? dayjs(`${value.date}T00:00`)
            : null;

    const tabLineButtonSx = (isActive) => ({
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.75,
        py: 1.25,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "'Inter', sans-serif",
        color: isActive ? accentTextColor : "hsl(240, 8%, 55%)",
        borderBottom: isActive ? `1px solid ${accentColor}` : "1px solid transparent",
        transition: "all 150ms ease",
        bgcolor: isActive ? `${softColor}40` : "transparent",
        "&:hover": {
            bgcolor: isActive ? `${softColor}60` : "hsl(240, 20%, 97%)",
        },
    });

    return (
        <Box ref={anchorRef} className="custom-date-time-picker">
            <Box className="custom-date-time-picker__trigger"
                onClick={handleToggle}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 0.875,
                    borderRadius: "10px",
                    fontSize: 14,
                    bgcolor: "hsl(240, 20%, 98%)",
                    border: "1px solid hsl(240, 10%, 88%)",
                    cursor: "pointer",
                    color: hasValue ? "hsl(240, 15%, 10%)" : "hsl(240, 10%, 65%)",
                    fontWeight: hasValue ? 600 : 400,
                    transition: "border-color 150ms ease",
                    "&:hover": {
                        borderColor: "hsl(240, 10%, 78%)",
                    },
                }}
            >
                <IoCalendarNumber size={16} style={{ color: "hsl(240, 8%, 55%)", flexShrink: 0 }} />
                <span ref={displayRef} className="custom-date-time-picker__display" style={{ flex: 1 }}>{displayText}</span>
                {hasValue && (
                    <Box className="custom-date-time-picker__clear"
                        onClick={handleClear}
                        sx={{
                            fontSize: 14,
                            color: "hsl(240, 8%, 60%)",
                            lineHeight: 1,
                            "&:hover": { color: "#dc2626" },
                        }}
                    >
                        x
                    </Box>
                )}
            </Box>

            <Popper className="custom-date-time-picker__popper"
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                sx={{ zIndex: 1400 }}
            >
                <Paper className="custom-date-time-picker__paper"
                    elevation={0}
                    sx={{
                        mt: 0.5,
                        borderRadius: "14px",
                        border: "1px solid hsl(240, 10%, 90%)",
                        boxShadow: "0 8px 24px rgb(0 0 0 / .12)",
                        width: "fit-content",
                    }}
                >
                    <ClickAwayListener className="custom-date-time-picker__clickaway" onClickAway={() => setOpen(false)}>
                        <Box className="custom-date-time-picker__popover">
                            <Box className="custom-date-time-picker__tabs" sx={{
                                display: "flex",
                                borderBottom: "1px solid hsl(240, 10%, 92%)",
                            }}>
                                <Box className="custom-date-time-picker__tab" onClick={() => setActiveTab("date")} sx={tabLineButtonSx(activeTab === "date")}>
                                    <IoCalendarNumber size={18} style={{ marginTop: "-2px" }} />
                                    Date
                                </Box>
                                <Box className="custom-date-time-picker__tab" onClick={() => setActiveTab("time")} sx={tabLineButtonSx(activeTab === "time")}>
                                    <FaClock size={18} style={{ marginTop: "-1px" }} />
                                    Time
                                </Box>
                            </Box>

                            <Box className="custom-date-time-picker__content" sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                {activeTab === "date" && (
                                    <Box className="custom-date-time-picker__date" sx={{
                                        ".MuiDateCalendar-root": {
                                            width: "auto",
                                            height: "100%",
                                        },
                                        ".MuiDayCalendar-slideTransition": {
                                            minHeight: 190,
                                        },
                                        ".MuiPickersCalendarHeader-root": {
                                            px: 1.5,
                                            fontFamily: "'Sora', sans-serif",
                                        },
                                        ".MuiPickersCalendarHeader-labelContainer": {
                                            fontFamily: "'Sora', sans-serif",
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: "hsl(240, 15%, 10%)",
                                        },
                                        ".MuiPickersArrowSwitcher-root": {
                                            "& button": {
                                                color: "hsl(240, 8%, 50%)",
                                                width: 28,
                                                height: 28,
                                                borderRadius: "8px",
                                                "&:hover": {
                                                    bgcolor: "hsl(240, 20%, 95%)",
                                                },
                                            },
                                        },
                                        ".MuiDayCalendar-weekDayLabel": {
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "hsla(0, 0%, 0%, 1.00)",
                                            fontFamily: "'Inter', sans-serif",
                                            width: 36,
                                            height: 30,
                                        },
                                        ".MuiDayCalendar-weekContainer": {
                                            my: 0,
                                        },
                                        ".MuiPickerDay-root": {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            fontFamily: "'Inter', sans-serif",
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            transition: "all 150ms ease",
                                            "&:hover": {
                                                bgcolor: "hsl(240, 20%, 95%) !important",
                                            },
                                            "&:not(.Mui-selected)": {
                                                borderColor: "transparent",
                                            },
                                        },
                                        ".MuiPickerDay-root.Mui-selected": {
                                            background: `${gradientColor || accentColor} !important`,
                                            color: "#fff !important",
                                            fontWeight: 700,
                                            "&:hover": {
                                                background: `${gradientColor || accentColor} !important`,
                                            },
                                        },
                                        ".MuiPickersDay-today:not(.Mui-selected)": {
                                            borderColor: accentColor,
                                        },
                                        ".MuiYearCalendar-button.Mui-selected": {
                                            background: `${gradientColor || accentColor} !important`,
                                            color: "#fff !important",
                                            fontWeight: 700,
                                            "&:hover": {
                                                background: `${gradientColor || accentColor} !important`,
                                            },
                                        },
                                        ".MuiMonthCalendar-button.Mui-selected": {
                                            background: `${gradientColor || accentColor} !important`,
                                            color: "#fff !important",
                                            fontWeight: 700,
                                            "&:hover": {
                                                backgroundColor: `${accentColor} !important`,
                                            },
                                        },
                                        ".MuiPickersDay-hiddenDaySpacing": {
                                            display: "none",
                                        },
                                    }}>
                                        <DateCalendar className="custom-date-time-picker__calendar"
                                            value={calendarValue}
                                            onChange={handleDateChange}
                                            minDate={dayjs()}
                                            disableFuture={false}
                                        />
                                    </Box>
                                )}

                                {activeTab === "time" && (
                                    <Box ref={timePickerBoxRef} className="custom-date-time-picker__time" sx={{
                                        ...TIME_TAB_SX,
                                        ".MuiPickersClock-hand": {
                                            backgroundColor: accentColor,
                                            height: "calc(50% - 20px)",
                                        },
                                        ".MuiClockPointer-root": {
                                            background: `${gradientColor || accentColor} !important`,
                                        },
                                        ".MuiClockPointer-thumb": {
                                            background: `${gradientColor || accentColor} !important`,
                                            border: `2px solid transparent`,
                                            width: 30,
                                            height: 30,
                                            top: "-20px",
                                            left: "calc(50% - 17px)",
                                        },
                                        ".MuiClock-pin": {
                                            backgroundColor: accentColor,
                                            width: 4,
                                            height: 4,
                                        },
                                        ".MuiPickersClock-center": {
                                            backgroundColor: accentColor,
                                            width: 8,
                                            height: 8,
                                        },
                                        ".MuiPickersToolbar-text.Mui-selected": {
                                            color: accentColor,
                                            opacity: 1,
                                        },
                                        ".MuiTimePickerToolbar-ampmLabel[data-selected]": {
                                            padding: "0 8px",
                                            backgroundColor: softColor,
                                            color: accentTextColor,
                                            borderRadius: "6px",
                                            opacity: 1,
                                        },
                                    }}>
                                        <StaticTimePicker className="custom-date-time-picker__clock"
                                            value={clockValue}
                                            onChange={handleTimeChange}
                                            views={["hours", "minutes"]}
                                            ampm={true}
                                            ampmInClock={false}
                                            disableToolbar={false}
                                            slotProps={{
                                                toolbar: {
                                                    hidden: false,
                                                },
                                            }}
                                            viewRenderers={{
                                                hours: interceptedViewRenderer,
                                                minutes: interceptedViewRenderer,
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Box className="custom-date-time-picker__actions" sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                                px: 2,
                                py: 1.25,
                                borderTop: "1px solid hsl(240, 10%, 92%)",
                                bgcolor: "hsl(240, 20%, 99%)",
                            }}>
                                <Button className="custom-date-time-picker__cancel-btn"
                                    onClick={handleCancel}
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        fontFamily: "'Inter', sans-serif",
                                        color: "hsl(240, 8%, 50%)",
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2,
                                        py: 0.5,
                                        minWidth: "auto",
                                        "&:hover": {
                                            bgcolor: "hsl(240, 20%, 95%)",
                                        },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button className="custom-date-time-picker__ok-btn"
                                    onClick={handleOK}
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        fontFamily: "'Inter', sans-serif",
                                        color: "#fff",
                                        background: gradientColor || accentColor,
                                        textTransform: "none",
                                        borderRadius: "8px",
                                        px: 2.5,
                                        py: 0.5,
                                        minWidth: "auto",
                                        boxShadow: `0 2px 8px ${accentColor}40`,
                                        "&:hover": {
                                            background: gradientColor || accentColor,
                                            filter: "brightness(1.1)",
                                        },
                                    }}
                                >
                                    OK
                                </Button>
                            </Box>
                        </Box>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </Box>
    );
}
