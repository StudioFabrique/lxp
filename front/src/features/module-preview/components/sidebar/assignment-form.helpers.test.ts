import { describe, expect, it } from "vitest";
import {
  assignmentFormIsValid,
  emptyAssignmentForm,
} from "./assignment-form.helpers";

describe("assignmentFormIsValid", () => {
  it("laisse un cours sans devoir valide", () => {
    expect(assignmentFormIsValid(emptyAssignmentForm())).toBe(true);
  });

  it("exige une échéance et des instructions", () => {
    expect(
      assignmentFormIsValid({
        ...emptyAssignmentForm(),
        required: true,
      }),
    ).toBe(false);
  });

  it("exige que les critères couvrent exactement le barème", () => {
    const assignment = {
      ...emptyAssignmentForm(),
      required: true,
      dueAt: "2026-10-01T12:00",
      instructions: "Produire une synthèse.",
      criteria: [
        { key: "a", label: "Fond", weight: 12 },
        { key: "b", label: "Forme", weight: 8 },
      ],
    };

    expect(assignmentFormIsValid(assignment)).toBe(true);
    expect(
      assignmentFormIsValid({
        ...assignment,
        criteria: assignment.criteria.slice(0, 1),
      }),
    ).toBe(false);
  });
});
