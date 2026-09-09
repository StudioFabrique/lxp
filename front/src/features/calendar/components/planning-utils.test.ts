import { describe, expect, it } from "vitest";
import { calendarDay, changePlanningDates } from "./planning-utils";
import type { TimelineEvent } from "./calendar-configuration";

const event: TimelineEvent = { id: 1, title: "Cours", startDate: new Date(2026, 8, 5), endDate: new Date(2026, 8, 9) };

describe("déplacement et redimensionnement des cours", () => {
  it("déplace toute la plage entre deux semaines en conservant sa durée", () => {
    const result = changePlanningDates(event, "move", 8);
    expect(result.startDate).toEqual(new Date(2026, 8, 13));
    expect(result.endDate).toEqual(new Date(2026, 8, 17));
    expect(event.startDate).toEqual(new Date(2026, 8, 5));
  });
  it("borne chaque bord à l'autre date, avec un minimum d'une journée", () => {
    const start = changePlanningDates(event, "start", 10);
    expect(start.startDate).toEqual(event.endDate);
    expect(start.endDate).toEqual(event.endDate);
    const end = changePlanningDates(event, "end", -10);
    expect(end.startDate).toEqual(event.startDate);
    expect(end.endDate).toEqual(event.startDate);
  });
  it("peut étendre les deux bords au-delà de la plage initiale", () => {
    expect(changePlanningDates(event, "start", -2).startDate).toEqual(new Date(2026, 8, 3));
    expect(changePlanningDates(event, "end", 2).endDate).toEqual(new Date(2026, 8, 11));
  });
  it("conserve les jours civils lors d'un changement d'heure et de mois", () => {
    const source = { ...event, startDate: new Date(2026, 9, 24), endDate: new Date(2026, 9, 26) };
    const result = changePlanningDates(source, "move", 8);
    expect(result.startDate).toEqual(new Date(2026, 10, 1));
    expect(calendarDay(result.endDate!) - calendarDay(result.startDate!)).toBe(2);
  });
});
