export type AssignmentScoreTone =
  | "success"
  | "warning"
  | "error"
  | "neutral";

export function assignmentScoreTone(
  score: number,
  maximum: number,
): AssignmentScoreTone {
  if (
    !Number.isFinite(score) ||
    !Number.isFinite(maximum) ||
    maximum <= 0
  ) {
    return "neutral";
  }

  const percentage = (score / maximum) * 100;
  if (percentage >= 60) return "success";
  if (percentage >= 40) return "warning";
  return "error";
}

export const assignmentScoreTextClass = {
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
  neutral: "text-base-content",
} satisfies Record<AssignmentScoreTone, string>;
