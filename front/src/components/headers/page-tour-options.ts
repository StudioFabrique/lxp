import type { FloatingOptions, Locale, Options } from "react-joyride";

/**
 * Habillage commun des visites guidées.
 *
 * Extrait de `PageHeader` pour que le tour de démonstration, qui traverse
 * plusieurs pages et ne peut donc pas vivre dans un en-tête, offre exactement
 * la même apparence et les mêmes libellés.
 */
export const pageTourFloatingOptions: FloatingOptions = {
  strategy: "fixed",
  shiftOptions: { mainAxis: true, crossAxis: true, padding: 16 },
  flipOptions: { padding: 16 },
};

export const pageTourOptions: Partial<Options> = {
  buttons: ["back", "primary", "skip"],
  closeButtonAction: "skip",
  dismissKeyAction: false,
  overlayClickAction: false,
  overlayColor: "rgba(2, 6, 23, 0.72)",
  primaryColor: "var(--color-primary)",
  backgroundColor: "var(--color-base-100)",
  textColor: "var(--color-base-content)",
  arrowColor: "var(--color-base-100)",
  showProgress: true,
  skipBeacon: true,
  spotlightRadius: 10,
  targetWaitTimeout: 5_000,
  zIndex: 2100,
};

export const pageTourLocale: Locale = {
  back: "Précédent",
  last: "Terminer",
  next: "Suivant",
  skip: "Quitter le tutoriel",
};
