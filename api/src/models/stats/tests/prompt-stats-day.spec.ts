import { promptStatsDay } from "../prompt-stats-day.ts";

describe("promptStatsDay", () => {
  it("ramène l'horodatage à minuit UTC", () => {
    expect(promptStatsDay(new Date("2026-08-19T22:13:45.000Z")).toISOString()).toBe(
      "2026-08-19T00:00:00.000Z",
    );
  });

  it("produit la même clé que l'ancienne chaîne YYYY-MM-DD", () => {
    // Les documents créés avant le passage à l'upsert doivent rester
    // adressables par cette clé.
    const now = new Date("2026-08-19T09:00:00.000Z");
    expect(promptStatsDay(now).getTime()).toBe(
      new Date(now.toISOString().slice(0, 10)).getTime(),
    );
  });
});
