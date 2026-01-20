/**
 * Fonction utilitaire pour nettoyer le chemin du fichier (retirer le ./ initial)
 */
export const cleanPath = (path: string) =>
  path.startsWith("./") ? path.substring(2) : path;
