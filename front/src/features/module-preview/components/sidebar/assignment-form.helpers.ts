import { assignmentFormSchema } from "../../assignment.schema";
import type { AssignmentFormValue } from "../../interfaces/assignment";

export const emptyAssignmentForm = (): AssignmentFormValue => ({
  required: false,
  dueAt: "",
  maxScore: 20,
  rubricVisible: true,
  instructions: "",
  criteria: [],
  files: [],
  removeFileIds: [],
});

export function assignmentDateForInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function assignmentFormIsValid(value: AssignmentFormValue) {
  return assignmentFormSchema.safeParse(value).success;
}

/** Premier motif pour lequel le devoir est incomplet, ou `null` s'il est valide. */
export function assignmentFormIssue(value: AssignmentFormValue): string | null {
  const result = assignmentFormSchema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? null);
}
