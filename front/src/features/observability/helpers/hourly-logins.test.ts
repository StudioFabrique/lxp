import { describe, expect, it } from "vitest";
import { groupLoginsByLocalHour } from "./hourly-logins";

const localHour = (hour: number, day = 23) =>
  new Date(2026, 10, day, hour, 30).toISOString();

describe("connexions par heure locale", () => {
  it("additionne les connexions d'une même heure sur plusieurs jours", () => {
    const hours = groupLoginsByLocalHour([
      { time: localHour(9, 23), count: 3 },
      { time: localHour(9, 24), count: 2 },
      { time: localHour(14, 23), count: 4 },
    ]);
    expect(hours).toHaveLength(24);
    expect(hours[9]).toBe(5);
    expect(hours[14]).toBe(4);
    expect(hours.reduce((sum, count) => sum + count, 0)).toBe(9);
  });

  it("ignore les horodatages invalides", () => {
    expect(groupLoginsByLocalHour([{ time: "n'importe quoi", count: 5 }]).every((count) => count === 0)).toBe(true);
  });
});
