import { defaultCourseDates, isValidCalendarDates } from "../course-calendar-dates.ts";

describe("dates du calendrier de module", () => {
  it("répartit les cours sur les dates inclusives du module dans l'ordre", () => {
    const dates = [0, 1, 2].map(index => defaultCourseDates(index, 3, new Date("2026-09-01"), new Date("2026-09-30")));
    expect(dates.map(date => [date.minDate.slice(0, 10), date.maxDate.slice(0, 10)])).toEqual([
      ["2026-09-01", "2026-09-10"], ["2026-09-11", "2026-09-20"], ["2026-09-21", "2026-09-30"],
    ]);
  });
  it("attribue une semaine par cours sans dates de module", () => {
    const date = defaultCourseDates(1, 3, null, null, new Date("2026-09-09T12:00:00Z"));
    expect(date.minDate).toBe("2026-09-16T00:00:00.000Z");
    expect(date.maxDate).toBe("2026-09-22T00:00:00.000Z");
  });
  it("autorise les cours d'un jour quand la période est plus courte que leur nombre", () => {
    const dates = [0, 1, 2].map(index => defaultCourseDates(index, 3, new Date("2026-09-01"), new Date("2026-09-01")));
    expect(dates.every(date => date.minDate === date.maxDate)).toBe(true);
  });
  it("valide la suppression complète et rejette les dates inversées, durées invalides et identifiants dupliqués", () => {
    const date = defaultCourseDates(0, 1, null, null);
    expect(isValidCalendarDates([])).toBe(true);
    expect(isValidCalendarDates([date])).toBe(true);
    expect(isValidCalendarDates([{ ...date, maxDate: "2000-01-01T00:00:00Z" }])).toBe(false);
    expect(isValidCalendarDates([{ ...date, minDate: "invalide" }])).toBe(false);
    expect(isValidCalendarDates([{ ...date, synchroneDuration: -1 }])).toBe(false);
    expect(isValidCalendarDates([date, date])).toBe(false);
  });
});
