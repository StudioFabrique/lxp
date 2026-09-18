const STORAGE_KEY = "andria:pending-root-activation-email";

export const getPendingRootActivationEmail = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
};

export const setPendingRootActivationEmail = (email: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, email.trim());
  } catch {
    // Le parcours reste utilisable si le stockage du navigateur est bloqué.
  }
};

export const clearPendingRootActivation = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Aucun traitement supplémentaire n'est nécessaire.
  }
};
