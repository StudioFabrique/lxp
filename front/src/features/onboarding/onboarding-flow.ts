import type { FormationParcoursSummary } from "../dashboard-admin/interfaces/parcours-summary";

export type OnboardingFlow = {
  kind: "administrator" | "teacher" | "student";
  canStart: boolean;
  firstStep: string;
  accessibleParcoursIds: number[];
};

export const ADMINISTRATOR_ONBOARDING_STAGES = [
  "admin-formation-entry",
  "admin-formation-fields",
  "admin-formation-save",
  "admin-parcours-create",
  "admin-complete",
] as const;

export const TEACHER_ONBOARDING_STAGES = [
  "admin-module-title",
  "admin-module-description",
  "admin-module-quiz-instructions",
  "admin-module-duration",
  "admin-module-save",
  "admin-course-create",
  "admin-course-details",
  "admin-lesson-create",
  "admin-lesson-details",
  "admin-activity-create",
  "admin-activity-type",
  "admin-text-editor",
  "admin-complete",
] as const;

export function resolveOnboardingFlow(
  layout: "admin" | "student",
  userRank: number,
  formations: FormationParcoursSummary[] = [],
): OnboardingFlow {
  if (layout === "student") {
    return {
      kind: "student",
      canStart: true,
      firstStep: "student-navigation",
      accessibleParcoursIds: [],
    };
  }

  if (userRank === 2) {
    const parcoursList = formations
      .flatMap((formation) => formation.parcours)
      .filter((item) => item.canManage !== false);
    const parcours = parcoursList[0];

    return {
      kind: "teacher",
      canStart: Boolean(parcours),
      firstStep: parcours ? `admin-module-title:${parcours.id}` : "",
      accessibleParcoursIds: parcoursList.map(({ id }) => id),
    };
  }

  return {
    kind: "administrator",
    canStart: userRank <= 1,
    firstStep: "admin-formation-entry",
    accessibleParcoursIds: [],
  };
}
