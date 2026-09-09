import type { TimelineEvent } from "./calendar-configuration";

// Les calculs portent sur des jours civils, y compris lors du changement d'heure.
export const calendarDay = (date: Date) =>
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;

export const shiftCalendarDate = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export type PlanningGesture = "move" | "start" | "end";

export function changePlanningDates(event: TimelineEvent, mode: PlanningGesture, days: number) {
  if (!event.startDate || !event.endDate) return event;
  const start = mode === "end" ? event.startDate : shiftCalendarDate(event.startDate, days);
  const end = mode === "start" ? event.endDate : shiftCalendarDate(event.endDate, days);
  return {
    ...event,
    startDate: mode === "start" && calendarDay(start) > calendarDay(end) ? end : start,
    endDate: mode === "end" && calendarDay(end) < calendarDay(start) ? start : end,
  };
}
