import { useCallback, useRef, useState } from "react";
import {
    Box, Button, ClickAwayListener, Grow, Paper, Popper,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import dayjs from "dayjs";
import { IoCalendarNumber } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";

const ACCENT_FALLBACK = "#7c3aed";
const SOFT_FALLBACK = "#f5f3ff";

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
    const anchorRef = useRef(null);

    const hasValue = !!(value.date);

    const displayText = (() => {
        if (!value.date) return "DD/MM/YYYY hh:mm A";
        const d = dayjs(value.date);
        if (value.time) {
            const t = dayjs(value.time, "HH:mm");
            return `${d.format("DD/MM/YYYY")} ${t.format("hh:mm A")}`;
        }
        return d.format("DD/MM/YYYY");
    })();

    const handleDateChange = useCallback((newDate) => {
        if (newDate && newDate.isValid()) {
            const dateStr = newDate.format("YYYY-MM-DD");
            onChange({ date: dateStr, time: value.time || "" });
        }
    }, [onChange, value.time]);

    const handleTimeChange = useCallback((newTime) => {
        if (newTime && newTime.isValid()) {
            const timeStr = newTime.format("HH:mm");
            onChange({ date: value.date || dayjs().format("YYYY-MM-DD"), time: timeStr });
        }
    }, [onChange, value.date]);

    const handleClear = useCallback((e) => {
        e.stopPropagation();
        onChange({ date: "", time: "" });
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

    return (
        <Box ref={anchorRef}>
            <Box
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
                <span style={{ flex: 1 }}>{displayText}</span>
                {hasValue && (
                    <Box
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

            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                transition
                sx={{ zIndex: 1400 }}
            >
                {({ TransitionProps }) => (
                    <Grow {...TransitionProps} style={{ transformOrigin: "top left" }}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 0.5,
                                borderRadius: "14px",
                                border: "1px solid hsl(240, 10%, 90%)",
                                boxShadow: "0 8px 24px rgb(0 0 0 / .12)",
                                width: "fit-content",
                            }}
                        >
                            <ClickAwayListener onClickAway={() => setOpen(false)}>
                                <Box>
                                    <Box sx={{
                                        display: "flex",
                                        borderBottom: "1px solid hsl(240, 10%, 92%)",
                                    }}>
                                        <Box
                                            onClick={() => setActiveTab("date")}
                                            sx={{
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
                                                color: activeTab === "date" ? accentTextColor : "hsl(240, 8%, 55%)",
                                                borderBottom: activeTab === "date"
                                                    ? `1px solid ${accentColor}`
                                                    : "1px solid transparent",
                                                transition: "all 150ms ease",
                                                bgcolor: activeTab === "date" ? `${softColor}40` : "transparent",
                                                "&:hover": {
                                                    bgcolor: activeTab === "date" ? `${softColor}60` : "hsl(240, 20%, 97%)",
                                                },
                                            }}
                                        >
                                            <IoCalendarNumber size={18} style={{ marginTop: "-2px" }} />
                                            Date
                                        </Box>
                                        <Box
                                            onClick={() => setActiveTab("time")}
                                            sx={{
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
                                                color: activeTab === "time" ? accentTextColor : "hsl(240, 8%, 55%)",
                                                borderBottom: activeTab === "time"
                                                    ? `1px solid ${accentColor}`
                                                    : "1px solid transparent",
                                                transition: "all 150ms ease",
                                                bgcolor: activeTab === "time" ? `${softColor}40` : "transparent",
                                                "&:hover": {
                                                    bgcolor: activeTab === "time" ? `${softColor}60` : "hsl(240, 20%, 97%)",
                                                },
                                            }}
                                        >
                                            <FaClock size={18} style={{ marginTop: "-1px" }} />
                                            Time
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        {activeTab === "date" && (
                                            <Box sx={{
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
                                                <DateCalendar
                                                    value={calendarValue}
                                                    onChange={handleDateChange}
                                                    minDate={dayjs()}
                                                    disableFuture={false}
                                                />
                                            </Box>
                                        )}

                                        {activeTab === "time" && (
                                            <Box sx={{
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
                                                    backgroundColor: accentColor,
                                                    height: "calc(50% - 20px)",
                                                },
                                                ".MuiClock-root": {
                                                    m: "0"
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
                                                    left: "calc(50% - 17px)"
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
                                                ".MuiPickersClockNumber-root": {
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    fontFamily: "'Inter', sans-serif",
                                                    color: "hsl(240, 15%, 20%)",
                                                },
                                                ".MuiPickersClockNumber-root.Mui-selected": {
                                                    background: `${gradientColor || accentColor} !important`,
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
                                                    "&.Mui-selected": {
                                                        color: accentColor,
                                                        opacity: 1,
                                                    },
                                                },
                                                ".MuiTimePickerToolbar-ampmLabel[data-selected]": {
                                                    padding: "0 8px",
                                                    backgroundColor: softColor,
                                                    color: accentTextColor,
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
                                                ".MuiPickersLayout-root": {
                                                    flexDirection: "column",
                                                    minWidth: "auto",
                                                },
                                                ".MuiPickersLayout-actionBar": {
                                                    display: "none",
                                                },
                                                ".MuiPickersLayout-contentWrapper": {
                                                    overflow: "hidden",
                                                },
                                                ".MuiPickersToolbar-root": {
                                                    minHeight: "auto",
                                                    py: 0,
                                                },
                                                ".MuiPickersToolbar-title": {
                                                    display: "none",
                                                },
                                            }}>
                                                <StaticTimePicker
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
                                                />
                                            </Box>
                                        )}
                                    </Box>

                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 1,
                                        px: 2,
                                        py: 1.25,
                                        borderTop: "1px solid hsl(240, 10%, 92%)",
                                        bgcolor: "hsl(240, 20%, 99%)",
                                    }}>
                                        <Button
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
                                        <Button
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
                    </Grow>
                )}
            </Popper>
        </Box>
    );
}
