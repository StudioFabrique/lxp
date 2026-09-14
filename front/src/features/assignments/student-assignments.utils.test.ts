import { describe, expect, it } from "vitest";
import type { StudentAssignmentListItem } from "./api/student-assignments.api";
import {
  assignmentStatus,
  filterStudentAssignments,
} from "./student-assignments.utils";

const assignment = (
  id: number,
  dueAt: string,
  submission: StudentAssignmentListItem["submissions"][number] | null = null,
): StudentAssignmentListItem => ({
  id,
  dueAt,
  maxScore: 20,
  course: {
    id,
    title: `Cours ${id}`,
    module: {
      id: 10,
      title: "Relation client",
      parcours: { id: 20, title: "Accueil" },
    },
  },
  submissions: submission ? [submission] : [],
});

const now = new Date("2026-09-14T12:00:00.000Z");

describe("liste apprenant des évaluations", () => {
  it("classe les échéances à venir de la plus proche à la plus lointaine", () => {
    const result = filterStudentAssignments(
      [
        assignment(1, "2026-09-20T12:00:00.000Z"),
        assignment(2, "2026-09-15T12:00:00.000Z"),
        assignment(3, "2026-09-13T12:00:00.000Z"),
      ],
      "upcoming",
      "",
      now,
    );
    expect(result.map(({ id }) => id)).toEqual([2, 1]);
  });

  it("classe les évaluations passées de la plus récente à la plus ancienne", () => {
    const result = filterStudentAssignments(
      [
        assignment(1, "2026-09-01T12:00:00.000Z"),
        assignment(2, "2026-09-13T12:00:00.000Z"),
      ],
      "past",
      "",
      now,
    );
    expect(result.map(({ id }) => id)).toEqual([2, 1]);
  });

  it("recherche dans le cours, le module, le parcours et le statut", () => {
    const graded = assignment(1, "2026-09-13T12:00:00.000Z", {
      id: 4,
      submittedAt: "2026-09-12T12:00:00.000Z",
      grade: 17,
      gradedAt: "2026-09-13T10:00:00.000Z",
    });
    expect(filterStudentAssignments([graded], "past", "relation", now)).toHaveLength(1);
    expect(filterStudentAssignments([graded], "past", "evalue", now)).toHaveLength(1);
    expect(assignmentStatus(graded, now)).toBe("Évalué");
  });
});
