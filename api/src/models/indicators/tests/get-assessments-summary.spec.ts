import { summarizeAssessments, scoreEvolution } from "../get-assessments-summary.ts";

describe("summarizeAssessments", () => {
  it("réunit les quiz et devoirs rendus, y compris ceux en attente de note", () => {
    const from = new Date("2026-09-01T00:00:00.000Z");
    const result = summarizeAssessments(
      [
        { at: new Date("2026-08-20T00:00:00.000Z"), rate: 80 },
        { at: new Date("2026-09-05T00:00:00.000Z"), rate: 30 },
        { at: new Date("2026-09-10T00:00:00.000Z"), rate: null },
      ],
      from,
    );

    expect(result).toEqual({
      periodCount: 2,
      cumulativeCount: 3,
      passRate: 0.5,
      scoreEvolution: -0.03125,
    });
  });

  it("ne confond pas absence de note et taux de réussite nul", () => {
    expect(
      summarizeAssessments(
        [{ at: new Date("2026-09-10T00:00:00.000Z"), rate: null }],
        new Date("2026-09-01T00:00:00.000Z"),
      ).passRate,
    ).toBeNull();
  });
});

describe("scoreEvolution", () => {
  const record = (day: number, rate: number | null, weight = 1) => ({ at: new Date(Date.UTC(2026, 0, day)), rate, weight });
  it("mesure une pente sur les dates réelles avec un historique irrégulier", () => {
    expect(scoreEvolution([record(1, 20), record(3, 40), record(9, 100)])).toBe(0.1);
  });
  it("n'invente pas de tendance avec une seule note ou une seule date", () => {
    expect(scoreEvolution([record(1, 20), record(2, null)])).toBeNull();
    expect(scoreEvolution([record(1, 20), record(1, 90)])).toBeNull();
  });
  it("applique les poids quand ils sont fournis", () => {
    expect(scoreEvolution([record(1, 0), record(2, 100), record(3, 0, 10)])).toBe(-0.176471);
  });
});
