import { describe, expect, it } from "vitest";
import { calendarCourseEvents, dateKey, layoutDayEvents, type ReadCalendar } from "./read-calendar-utils";
import type { CalendarEvent } from "./calendar-configuration";

const data: ReadCalendar = { id: 1, title: "Parcours", modules: [{ id: 2, title: "Module", minDate: null, maxDate: null, courses: [{
  id: 3, title: "Cours", lessons: [{ id: 4 }], dates: [{ id: 1, minDate: "2026-10-24T00:00:00.000Z", maxDate: "2026-10-26T00:00:00.000Z", startTime: "08:30", endTime: "12:15", synchroneDuration: 0, asynchroneDuration: 0 }],
}] }] };

describe("cours en lecture", () => {
  it("répète les heures chaque jour, bornes incluses, sans décalage au changement d'heure", () => {
    const events = calendarCourseEvents(data, new Date(2026, 9, 24), "month", "student");
    expect(events.map(event => dateKey(event.date!))).toEqual(["2026-10-24", "2026-10-25", "2026-10-26"]);
    expect(events.every(event => event.start === "08:30" && event.end === "12:15" && !event.allDay)).toBe(true);
    expect(new Set(events.map(event => event.id)).size).toBe(3);
    expect(events[0]).toMatchObject({ to: "/student/parcours/module/2", navigationState: { lessonId: 4, courseId: 3 } });
  });
  it("limite le développement à la journée/semaine visible et inclut la fin de plage", () => {
    expect(calendarCourseEvents(data, new Date(2026, 9, 26), "day", "admin")).toHaveLength(1);
    expect(calendarCourseEvents(data, new Date(2026, 9, 27), "day", "admin")).toHaveLength(0);
    expect(calendarCourseEvents(data, new Date(2026, 9, 26), "week", "admin")).toHaveLength(1);
    expect(calendarCourseEvents(data, new Date(), "year-timeline", "admin")).toEqual([]);
  });
  it("conserve les cours sans horaires et distingue plusieurs plages du même cours", () => {
    const copy = structuredClone(data);
    const course = copy.modules[0].courses[0];
    delete course.dates[0].startTime; delete course.dates[0].endTime;
    course.dates.push({ ...course.dates[0], id: 2, startTime: "15:00", endTime: "16:00" });
    const events = calendarCourseEvents(copy, new Date(2026, 9, 24), "day", "admin");
    expect(events).toHaveLength(2);
    expect(events[0].allDay).toBe(true);
    expect(events[1].allDay).toBe(false);
    expect(events[0].id).not.toBe(events[1].id);
  });
});
const event = (id: number, start: string, end: string): CalendarEvent => ({ id, start, end, title: `Cours ${id}`, type: "primary" });
describe("chevauchements", () => {
  it("place deux cours côte à côte et reporte le troisième dans la liste", () => {
    const result = layoutDayEvents([event(1, "09:00", "12:00"), event(2, "10:00", "11:00"), event(3, "10:30", "11:30")]);
    expect(result.visible.map(item => [item.event.id, item.lane, item.columns])).toEqual([[1, 0, 2], [2, 1, 2]]);
    expect(result.hidden.map(item => item.id)).toEqual([3]);
  });
  it("réutilise une piste pour deux plages contiguës et garde les cours isolés en pleine largeur", () => {
    const result = layoutDayEvents([event(1, "09:00", "12:00"), event(2, "10:00", "11:00"), event(3, "11:00", "12:00"), event(4, "14:00", "15:00")]);
    expect(result.hidden).toEqual([]);
    expect(result.visible.map(item => [item.lane, item.columns])).toEqual([[0, 2], [1, 2], [1, 2], [0, 1]]);
  });
});
