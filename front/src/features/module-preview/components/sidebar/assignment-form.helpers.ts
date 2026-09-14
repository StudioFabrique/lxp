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
  if (!value.required) return true;
  if (!value.dueAt || !value.instructions.trim() || value.maxScore <= 0) {
    return false;
  }
  if (
    value.criteria.some(
      (criterion) => !criterion.label.trim() || criterion.weight <= 0,
    )
  ) {
    return false;
  }
  if (value.criteria.length > 0) {
    const total = value.criteria.reduce(
      (sum, criterion) => sum + criterion.weight,
      0,
    );
    return Math.abs(total - value.maxScore) < 0.001;
  }
  return true;
}
