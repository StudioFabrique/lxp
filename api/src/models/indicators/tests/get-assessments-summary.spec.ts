import { summarizeAssessments } from "../get-assessments-summary.ts";

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
