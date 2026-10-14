export const autoSubmitTimer =
  import.meta.env.VITE_ENVIRONMENT === "development" ? 500 : 2000;

/** Identifiant commun des toasts de succès des sauvegardes automatiques : ils se remplacent au lieu de s'empiler. */
export const autoSaveToastId = "auto-save-success";

/** Délai entre la perte de focus d'un champ et l'enregistrement automatique. */
export const autoSaveBlurDelay = 600;
