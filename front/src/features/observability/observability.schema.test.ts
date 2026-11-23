import { describe, expect, it } from "vitest";
import { customRangeSchema } from "./observability.schema";

const schema = customRangeSchema("2026-11-23");
const messageOf = (startDate: string, endDate: string) =>
  schema.safeParse({ startDate, endDate }).error?.issues[0]?.message;

describe("intervalle du calendrier", () => {
  it("accepte un jour ou plusieurs jours, jusqu'à aujourd'hui", () => {
    expect(schema.safeParse({ startDate: "2026-11-23", endDate: "2026-11-23" }).success).toBe(true);
    expect(schema.safeParse({ startDate: "2026-11-01", endDate: "2026-11-23" }).success).toBe(true);
  });

  it("refuse une fin avant le début, une fin future et une date manquante", () => {
    expect(messageOf("2026-11-10", "2026-11-09")).toContain("postérieure");
    expect(messageOf("2026-11-20", "2026-11-24")).toContain("futur");
    expect(messageOf("", "2026-11-20")).toBe("Choisissez une date.");
  });

  it("refuse une date inexistante", () => {
    expect(messageOf("2026-02-31", "2026-03-05")).toBe("Date invalide.");
  });

  it("refuse un début plus ancien que la conservation des journaux", () => {
    expect(messageOf("2026-09-01", "2026-09-05")).toContain("conservés");
  });
});
