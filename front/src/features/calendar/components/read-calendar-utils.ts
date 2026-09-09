import type CourseDates from "../../course/interfaces/course-dates";
import type { CalendarEvent, CalendarView } from "./calendar-configuration";
import { getMonthDays, getWeekBounds } from "./calendar-utils";

export type ReadCalendarModule = {
  id: number; title: string; description?: string | null; minDate: string | null; maxDate: string | null;
  courses: { id: number; title: string; description?: string | null; dates: CourseDates[]; lessons: { id: number }[] }[];
};
export type ReadCalendar = { id: number; title: string; modules: ReadCalendarModule[] };
export const localDate = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);
export const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function visibleDateBounds(date: Date, view: CalendarView) {
  if (view === "month") {
    const days = getMonthDays(date.getFullYear(), date.getMonth());
    return { firstDay: days[0].date, lastDay: days[days.length - 1].date };
  }
  if (view === "week") return getWeekBounds(date);
  return { firstDay: date, lastDay: date };
}

/** Développe seulement la période visible, en jours locaux (y compris les changements d'heure). */
export function calendarCourseEvents(data: ReadCalendar | undefined, date: Date, view: CalendarView, area: string): CalendarEvent[] {
  if (!data || view === "year-timeline") return [];
  const { firstDay, lastDay } = visibleDateBounds(date, view);
  const first = dateKey(firstDay), last = dateKey(lastDay);
  return data.modules.flatMap((module, moduleIndex) => module.courses.flatMap(course => course.dates.flatMap((range, index) => {
    if (!range || !range.minDate || !range.maxDate) return [];
    const start = range.minDate.slice(0, 10), end = range.maxDate.slice(0, 10);
    if (start > last || end < first || start > end) return [];
    const events: CalendarEvent[] = [];
    const day = localDate(start > first ? start : first);
    const final = end < last ? end : last;
    while (Number.isFinite(day.getTime()) && dateKey(day) <= final) {
      events.push({
        id: `${course.id}:${index}:${dateKey(day)}`, title: course.title, subtitle: module.title,
        description: course.description ?? undefined, date: new Date(day),
        start: range.startTime ?? "", end: range.endTime ?? "", allDay: !range.startTime || !range.endTime,
        rangeStart: range.minDate, rangeEnd: range.maxDate,
        type: (["primary", "secondary", "accent", "neutral"] as const)[moduleIndex % 4],
        to: `/${area}/parcours/module/${module.id}`,
        navigationState: { lessonId: course.lessons[0]?.id, courseId: course.id },
      });
      day.setDate(day.getDate() + 1);
    }
    return events;
  })));
}

export const minutes = (time: string) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };

/** Deux pistes au maximum ; les plages contiguës peuvent réutiliser une piste. */
export function layoutDayEvents(events: CalendarEvent[]) {
  const timed = events.filter(event => !event.allDay).sort((a, b) => minutes(a.start) - minutes(b.start) || minutes(a.end) - minutes(b.end) || String(a.id).localeCompare(String(b.id)));
  const visible: { event: CalendarEvent; lane: number; columns: number }[] = [];
  const hidden: CalendarEvent[] = [];
  let group: typeof visible = [];
  let groupEnd = -1;
  let laneEnds = [-1, -1];
  const finishGroup = () => {
    const columns = group.some(item => item.lane === 1) ? 2 : 1;
    visible.push(...group.map(item => ({ ...item, columns })));
    group = [];
  };
  for (const event of timed) {
    const start = minutes(event.start), end = minutes(event.end);
    if (start >= groupEnd) { finishGroup(); laneEnds = [-1, -1]; }
    groupEnd = Math.max(groupEnd, end);
    const lane = laneEnds.findIndex(laneEnd => laneEnd <= start);
    if (lane === -1) hidden.push(event);
    else { laneEnds[lane] = end; group.push({ event, lane, columns: 1 }); }
  }
  finishGroup();
  return { visible, hidden, allDay: events.filter(event => event.allDay) };
}
