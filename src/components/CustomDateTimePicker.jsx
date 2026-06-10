import { useCallback, useRef, useState } from "react";
import {
    Box, Button, ClickAwayListener, Grow, Paper, Popper,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import dayjs from "dayjs";
import { IoCalendarNumber, IoTimeOutline } from "react-icons/io5";

const ACCENT_FALLBACK = "#7c3aed";
const SOFT_FALLBACK = "#f5f3ff";

export default function CustomDateTimePicker({
    value = { date: "", time: "" },
    onChange,
    accentColor = ACCENT_FALLBACK,
    softColor = SOFT_FALLBACK,
    label = "Target Date & Time",
}) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("date");
    const anchorRef = useRef(null);

    const hasValue = !!(value.date);

    const displayText = (() => {
        if (!value.date) return "DD/MM/YYYY HH:mm";
        const d = dayjs(value.date);
        if (value.time) {
            return `${d.format("DD/MM/YYYY")} ${value.time}`;
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
                                overflow: "hidden",
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
                                                fontSize: 13,
                                                fontWeight: 600,
                                                fontFamily: "'Inter', sans-serif",
                                                color: activeTab === "date" ? accentColor : "hsl(240, 8%, 55%)",
                                                borderBottom: activeTab === "date"
                                                    ? `2px solid ${accentColor}`
                                                    : "2px solid transparent",
                                                transition: "all 150ms ease",
                                                bgcolor: activeTab === "date" ? `${softColor}40` : "transparent",
                                                "&:hover": {
                                                    bgcolor: activeTab === "date" ? `${softColor}60` : "hsl(240, 20%, 97%)",
                                                },
                                            }}
                                        >
                                            <IoCalendarNumber size={15} />
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
                                                fontSize: 13,
                                                fontWeight: 600,
                                                fontFamily: "'Inter', sans-serif",
                                                color: activeTab === "time" ? accentColor : "hsl(240, 8%, 55%)",
                                                borderBottom: activeTab === "time"
                                                    ? `2px solid ${accentColor}`
                                                    : "2px solid transparent",
                                                transition: "all 150ms ease",
                                                bgcolor: activeTab === "time" ? `${softColor}40` : "transparent",
                                                "&:hover": {
                                                    bgcolor: activeTab === "time" ? `${softColor}60` : "hsl(240, 20%, 97%)",
                                                },
                                            }}
                                        >
                                            <IoTimeOutline size={15} />
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
                                                    backgroundColor: `${accentColor} !important`,
                                                    color: "#fff !important",
                                                    fontWeight: 700,
                                                    "&:hover": {
                                                        backgroundColor: `${accentColor} !important`,
                                                    },
                                                },
                                                ".MuiPickersDay-today:not(.Mui-selected)": {
                                                    borderColor: accentColor,
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
                                                ".MuiTimeClock-root": {
                                                    width: 250,
                                                    height: 250,
                                                },
                                                ".MuiPickersClock-root": {
                                                    width: 250,
                                                    height: 250,
                                                },
                                                ".MuiPickersClock-squareMask": {
                                                    borderRadius: "50%",
                                                },
                                                ".MuiPickersClock-hand": {
                                                    backgroundColor: accentColor,
                                                    height: "calc(50% - 20px)",
                                                },
                                                ".MuiClockPointer-root": {
                                                    backgroundColor: accentColor,
                                                },
                                                ".MuiClockPointer-thumb": {
                                                    backgroundColor: accentColor,
                                                    border: `2px solid ${accentColor}`,
                                                    width: 32,
                                                    height: 32,
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
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    fontFamily: "'Inter', sans-serif",
                                                    color: "hsl(240, 15%, 20%)",
                                                },
                                                ".MuiPickersClockNumber-root.Mui-selected": {
                                                    backgroundColor: `${accentColor} !important`,
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: "50%",
                                                },
                                                ".MuiPickersClockNumber-label": {
                                                    transform: "none",
                                                },
                                                ".MuiPickersArrowSwitcher-root": {
                                                    mt: 0.5,
                                                    "& button": {
                                                        color: "hsl(240, 8%, 50%)",
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: "8px",
                                                        "&:hover": {
                                                            bgcolor: "hsl(240, 20%, 95%)",
                                                        },
                                                    },
                                                },
                                                ".MuiPickersToolbar-content": {
                                                    px: 2,
                                                    mt: 0.5,
                                                },
                                                ".MuiTimeClockToolbarContent": {
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    py: 0.5,
                                                },
                                                ".MuiPickersToolbar-text": {
                                                    fontFamily: "'Sora', sans-serif",
                                                    fontWeight: 700,
                                                    fontSize: 28,
                                                    color: accentColor,
                                                    "&.Mui-selected": {
                                                        color: accentColor,
                                                    },
                                                },
                                                ".MuiPickersToolbarSeparator": {
                                                    mx: 0.5,
                                                    fontWeight: 700,
                                                    fontSize: 28,
                                                    fontFamily: "'Sora', sans-serif",
                                                    color: "hsl(240, 8%, 70%)",
                                                },
                                            }}>
                                                <TimeClock
                                                    value={clockValue}
                                                    onChange={handleTimeChange}
                                                    views={["hours", "minutes"]}
                                                    ampm={false}
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
                                                bgcolor: accentColor,
                                                textTransform: "none",
                                                borderRadius: "8px",
                                                px: 2.5,
                                                py: 0.5,
                                                minWidth: "auto",
                                                boxShadow: `0 2px 8px ${accentColor}40`,
                                                "&:hover": {
                                                    bgcolor: accentColor,
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
