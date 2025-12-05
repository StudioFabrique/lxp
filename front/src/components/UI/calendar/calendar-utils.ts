// --- UTILS ---

import { CalendarView, HOUR_HEIGHT } from "./calendar-configuration";

export const getMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Helper to get days for the Month Grid
export const getMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();

  // Adjust so 0 is Monday, 6 is Sunday
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay === -1) startDay = 6;

  const days = [];

  // Padding for previous month
  for (let i = 0; i < startDay; i++) {
    days.push({ day: 0, currentMonth: false });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }

  // Padding for next month to fill grid
  while (days.length % 7 !== 0) {
    days.push({ day: 0, currentMonth: false });
  }

  return days;
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
