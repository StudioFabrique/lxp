// --- UTILS ---

import { CalendarView, HOUR_HEIGHT } from "./calendar-configuration";

export const getMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Helper to get days for the Month Grid
export const getMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);

  // Adjust so 0 is Monday, 6 is Sunday
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay === -1) startDay = 6;

  // We start 'startDay' days before the 1st of the month
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDay);

  const days = [];

  // Generate a 5-week (35 days) or 6-week (42 days) grid
  // 42 covers all possible month configurations
  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);

    days.push({
      date: current,
      currentMonth: current.getMonth() === month,
    });
  }

  return days;
};

export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getRealDayIndex = (
  viewIndex: number,
  view: CalendarView,
  currentDate: Date
) => {
  if (view === "week") return viewIndex;
  let dayIndex = currentDate.getDay() - 1;
  if (dayIndex === -1) dayIndex = 6;
  return dayIndex;
};

export const getEventStyle = (
  start: string,
  end: string,
  calendarStartHour: number
) => {
  const startMin = getMinutes(start);
  const endMin = getMinutes(end);
  const startOffset = calendarStartHour * 60;
  const top = ((startMin - startOffset) / 60) * HOUR_HEIGHT;
  const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;
  return { top: `${top}px`, height: `${height}px` };
};

export const getCurrentTimeIndicator = (
  nowTime: Date,
  startHour: number,
  endHour: number
) => {
  const currentMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
  const startOffset = startHour * 60;
  const top = ((currentMinutes - startOffset) / 60) * HOUR_HEIGHT;
  let dayIndex = nowTime.getDay() - 1;
  if (dayIndex === -1) dayIndex = 6;

  if (nowTime.getHours() < startHour || nowTime.getHours() >= endHour)
    return null;
  return { top: `${top}px`, dayIndex };
};

export const getWeekBounds = (date: Date) => {
  const d = new Date(date);

  // Get day index where Monday = 0, Sunday = 6
  let dayIndex = d.getDay() - 1;
  if (dayIndex === -1) dayIndex = 6; // Sunday becomes 6

  // Calculate first day (Monday) of the week
  const firstDay = new Date(d);
  firstDay.setDate(d.getDate() - dayIndex);

  // Calculate last day (Sunday) of the week
  const lastDay = new Date(d);
  lastDay.setDate(d.getDate() + (6 - dayIndex));

  return { firstDay, lastDay };
};
