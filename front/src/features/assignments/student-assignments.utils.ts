import { normalizeSearchText } from "../../utils/helpers/normalize-search-text";
import type { StudentAssignmentListItem } from "./api/student-assignments.api";

export type AssignmentPeriod = "upcoming" | "past";

export function assignmentStatus(
  assignment: StudentAssignmentListItem,
  now: Date,
) {
  const submission = assignment.submissions[0];
  if (submission?.grade !== null && submission?.grade !== undefined) {
    return "Évalué";
  }
  if (submission?.submittedAt) return "Remis";
  if (new Date(assignment.dueAt).getTime() < now.getTime()) return "Non remis";
  return "À remettre";
}

export function filterStudentAssignments(
  assignments: StudentAssignmentListItem[],
  period: AssignmentPeriod,
  search: string,
  now: Date,
) {
  const normalizedSearch = normalizeSearchText(search);
  return assignments
    .filter((assignment) => {
      const isPast = new Date(assignment.dueAt).getTime() < now.getTime();
      if ((period === "past") !== isPast) return false;
      if (!normalizedSearch) return true;
      return [
        assignment.course.title,
        assignment.course.module.title,
        assignment.course.module.parcours.title,
        assignmentStatus(assignment, now),
      ].some((value) =>
        normalizeSearchText(value).includes(normalizedSearch),
      );
    })
    .sort((first, second) => {
      const difference =
        new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime();
      return period === "upcoming" ? difference : -difference;
    });
}
