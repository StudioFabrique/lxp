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
const HIGHLIGHT_MS = 2200;
// Les modules sont une liste, pas un bloc à corriger : « Corriger » se limite à ouvrir leur étape.
const STEP_ONLY_KEYS = new Set(["modules"]);
// Noms de classes complets pour que Tailwind les détecte à la compilation.
const HIGHLIGHT_CLASSES = ["ring-2", "ring-primary", "ring-offset-2", "ring-offset-base-100", "rounded-lg", "outline-none"];

const highlightTarget = (target: HTMLElement): void => {
  // Le bloc n'est pas un contrôle : un `tabindex` négatif lui permet de recevoir le focus sans entrer dans l'ordre de tabulation.
  if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.classList.add(...HIGHLIGHT_CLASSES);
  window.setTimeout(() => target.classList.remove(...HIGHLIGHT_CLASSES), HIGHLIGHT_MS);
};

export const getValidationStep = (key: string): number | undefined =>
  STEP_BY_VALIDATION_KEY[key];

/**
 * Affiche l'étape concernée puis centre en douceur le bloc repéré par
 * `#parcours-field-<clé>`, une fois l'étape rendue. Le bloc reçoit le focus et se met en évidence
 * un instant, pour qu'on voie où corriger. Les modules (étape 4) n'ont pas de bloc unique : seule l'étape s'ouvre.
 */
export const goToValidationTarget = (
  key: string,
  updateStep: (step: number) => void,
): void => {
  const step = getValidationStep(key);
  if (step === undefined) return;
  updateStep(step);
  if (STEP_ONLY_KEYS.has(key)) return;

  const start = performance.now();
  const scrollToField = () => {
    const target = document.getElementById(`parcours-field-${key}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      highlightTarget(target);
      return;
    }
    if (performance.now() - start < FIELD_WAIT_MS) {
      requestAnimationFrame(scrollToField);
    }
  };
  requestAnimationFrame(scrollToField);
};
