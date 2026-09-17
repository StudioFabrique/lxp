import { describe, expect, it } from "vitest";
import type { TeacherAssignmentListItem } from "./api/teacher-assignments.api";
import {
  filterTeacherAssignments,
  teacherAssignmentIsGraded,
  teacherAssignmentStudentStatus,
} from "./teacher-assignments.utils";

const assignment = (
  id: number,
  dueAt: string,
  parcours: string,
): TeacherAssignmentListItem => ({
  id,
  dueAt,
  maxScore: 20,
  course: {
    id,
    title: `Cours ${id}`,
    module: {
      id: 10,
      title: "Relation client",
      parcours: { id: 20, title: parcours },
    },
  },
  students: [
    {
      id: "student-1",
      firstname: "Élodie",
      lastname: "Martin",
      email: "elodie@example.com",
      submission: null,
    },
  ],
});

describe("liste formateur des évaluations", () => {
  it("filtre par parcours et classe les échéances les plus proches en premier", () => {
    const result = filterTeacherAssignments(
      [
        assignment(1, "2026-09-20T12:00:00.000Z", "Accueil"),
        assignment(2, "2026-09-16T12:00:00.000Z", "Accueil"),
        assignment(3, "2026-09-15T12:00:00.000Z", "Vente"),
      ],
      "Accueil",
      "",
    );

    expect(result.map(({ id }) => id)).toEqual([2, 1]);
  });

  it("recherche dans les évaluations et les étudiants sans tenir compte des accents", () => {
    const item = assignment(
      1,
      "2026-09-20T12:00:00.000Z",
      "Accueil",
    );

    expect(filterTeacherAssignments([item], null, "elodie")).toHaveLength(1);
    expect(filterTeacherAssignments([item], null, "relation")).toHaveLength(1);
    expect(filterTeacherAssignments([item], null, "inconnu")).toHaveLength(0);
  });

  it("distingue les travaux à remettre, à évaluer et évalués", () => {
    const student = assignment(
      1,
      "2026-09-20T12:00:00.000Z",
      "Accueil",
    ).students[0];

    expect(teacherAssignmentStudentStatus(student)).toBe("À remettre");
    expect(
      teacherAssignmentStudentStatus({
        ...student,
        submission: {
          id: 1,
          submittedAt: "2026-09-14T12:00:00.000Z",
          grade: null,
        },
      }),
    ).toBe("À évaluer");
    expect(
      teacherAssignmentStudentStatus({
        ...student,
        submission: { id: 1, grade: 16 },
      }),
    ).toBe("Évalué");
  });
  it("place un devoir partiellement noté dans les non évalués et le déplace une fois tous les rendus notés", () => {
    const item = assignment(1, "2026-09-20T12:00:00.000Z", "Accueil");
    item.students[0].submission = { id: 1, submittedAt: "2026-09-14T12:00:00.000Z", grade: 16 };
    item.students.push({ ...item.students[0], id: "student-2", submission: { id: 2, submittedAt: "2026-09-14T12:00:00.000Z", grade: null } });
    expect(teacherAssignmentIsGraded(item)).toBe(false);
    expect(filterTeacherAssignments([item], null, "", "ungraded")).toHaveLength(1);
    expect(filterTeacherAssignments([item], null, "", "graded")).toHaveLength(0);
    item.students[1].submission!.grade = 12;
    expect(teacherAssignmentIsGraded(item)).toBe(true);
    expect(filterTeacherAssignments([item], null, "", "graded")).toHaveLength(1);
  });
});
