/** Étape de l'édition de parcours à corriger pour chaque règle de validation. */
const STEP_BY_VALIDATION_KEY: Record<string, number> = {
  title: 1,
  dates: 1,
  tags: 1,
  contacts: 1,
  objectives: 2,
  skills: 3,
  modules: 4,
  groups: 6,
};

const FIELD_WAIT_MS = 1500;

export const getValidationStep = (key: string): number | undefined =>
  STEP_BY_VALIDATION_KEY[key];

/**
 * Affiche l'étape concernée puis centre en douceur le bloc repéré par
 * `#parcours-field-<clé>`, une fois l'étape rendue.
 */
export const goToValidationTarget = (
  key: string,
  updateStep: (step: number) => void,
): void => {
  const step = getValidationStep(key);
  if (step === undefined) return;
  updateStep(step);

  const start = performance.now();
  const scrollToField = () => {
    const target = document.getElementById(`parcours-field-${key}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (performance.now() - start < FIELD_WAIT_MS) {
      requestAnimationFrame(scrollToField);
    }
  };
  requestAnimationFrame(scrollToField);
};
