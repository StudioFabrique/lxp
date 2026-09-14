import { describe, expect, it } from "vitest";
import { assignmentScoreTone } from "./assignment-score-color";

describe("assignmentScoreTone", () => {
  it.each([
    [16, 20, "success"],
    [12, 20, "success"],
    [11.5, 20, "warning"],
    [8, 20, "warning"],
    [7.5, 20, "error"],
  ] as const)("classe %s/%s en %s", (score, maximum, expected) => {
    expect(assignmentScoreTone(score, maximum)).toBe(expected);
  });

  it("reste neutre lorsque le barème est invalide", () => {
    expect(assignmentScoreTone(10, 0)).toBe("neutral");
  });
});
