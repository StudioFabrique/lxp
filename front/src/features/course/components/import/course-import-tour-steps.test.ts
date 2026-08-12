import { describe, expect, it } from "vitest";

import { CoursesImportStep } from "../../hooks/useImportCourses";
import { getCourseImportTourSteps } from "./course-import-tour-steps";

const getStepIds = (
  step: CoursesImportStep,
  overrides: Partial<Parameters<typeof getCourseImportTourSteps>[0]> = {},
) =>
  getCourseImportTourSteps({
    step,
    hasSelectedFormation: false,
    hasSelectedParcours: false,
    isComplete: false,
    hasCriticalError: false,
    ...overrides,
  }).map((tourStep) => tourStep.id);

describe("getCourseImportTourSteps", () => {
  it("présente le dépôt puis le contrôle détaillé de l’archive", () => {
    expect(getStepIds(CoursesImportStep.MbzImport)).toContain(
      "course-import-upload",
    );
    expect(getStepIds(CoursesImportStep.CoursesPreview)).toEqual(
      expect.arrayContaining([
        "course-import-preview-actions",
        "course-import-tree",
        "course-import-activity-preview",
      ]),
    );
  });

  it("ajoute les étapes de destination au rythme des sélections", () => {
    const initialIds = getStepIds(CoursesImportStep.ParcoursSelection);
    const formationIds = getStepIds(CoursesImportStep.ParcoursSelection, {
      hasSelectedFormation: true,
    });
    const parcoursIds = getStepIds(CoursesImportStep.ParcoursSelection, {
      hasSelectedFormation: true,
      hasSelectedParcours: true,
    });

    expect(initialIds).not.toContain("course-import-parcours");
    expect(formationIds).toContain("course-import-parcours");
    expect(formationIds).not.toContain("course-import-module");
    expect(parcoursIds).toContain("course-import-module");
  });

  it("propose l’action finale uniquement quand le traitement est terminé ou interrompu", () => {
    expect(getStepIds(CoursesImportStep.ImportResult)).not.toContain(
      "course-import-result-actions",
    );
    expect(
      getStepIds(CoursesImportStep.ImportResult, { isComplete: true }),
    ).toContain("course-import-result-actions");
    expect(
      getStepIds(CoursesImportStep.ImportResult, {
        hasCriticalError: true,
      }),
    ).toContain("course-import-result-actions");
  });
});
