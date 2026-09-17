import { normalizeSearchText } from "../../utils/helpers/normalize-search-text";
import type {
  TeacherAssignmentListItem,
  TeacherAssignmentStudent,
} from "./api/teacher-assignments.api";

export function teacherAssignmentStudentStatus(
  student: TeacherAssignmentStudent,
) {
  if (
    student.submission?.grade !== null &&
    student.submission?.grade !== undefined
  ) {
    return "Évalué";
  }
  if (student.submission?.submittedAt) return "À évaluer";
  return "À remettre";
}

export type TeacherAssignmentEvaluationFilter = "ungraded" | "graded";

export function teacherAssignmentIsGraded(assignment: TeacherAssignmentListItem) {
  return assignment.students.length > 0 && assignment.students.every(
    student => student.submission?.submittedAt && student.submission.grade !== null && student.submission.grade !== undefined,
  );
}

export function filterTeacherAssignments(
  assignments: TeacherAssignmentListItem[],
  selectedParcours: string | null,
  search: string,
  evaluationFilter?: TeacherAssignmentEvaluationFilter,
) {
  const normalizedSearch = normalizeSearchText(search);

  return assignments
    .filter((assignment) => {
      if (evaluationFilter && teacherAssignmentIsGraded(assignment) !== (evaluationFilter === "graded")) return false;
      if (
        selectedParcours !== null &&
        assignment.course.module.parcours.title !== selectedParcours
      ) {
        return false;
      }
      if (!normalizedSearch) return true;

      const searchableValues = [
        assignment.course.title,
        assignment.course.module.title,
        assignment.course.module.parcours.title,
        ...assignment.students.flatMap((student) => [
          student.firstname,
          student.lastname,
          `${student.firstname} ${student.lastname}`,
          student.email,
          teacherAssignmentStudentStatus(student),
        ]),
      ];

      return searchableValues.some((value) =>
        normalizeSearchText(value).includes(normalizedSearch),
      );
    })
    .sort((first, second) => {
      const dueDateDifference = evaluationFilter === "graded"
        ? new Date(second.dueAt).getTime() - new Date(first.dueAt).getTime()
        : new Date(first.dueAt).getTime() - new Date(second.dueAt).getTime();
      if (dueDateDifference !== 0) return dueDateDifference;
      return first.course.title.localeCompare(second.course.title, "fr", {
        numeric: true,
        sensitivity: "base",
      });
    });
}
