/**
 * Détermine si une erreur de requête est due à l'indisponibilité du serveur
 * IA (erreur réseau ou réponse serveur >= 500) plutôt qu'à une erreur
 * métier (ex: 400, 401, 403).
 */
const isAiServerError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const response = (error as { response?: { status?: number } }).response;
  if (!response) return true;
  const status = response.status;
  return typeof status === "number" && status >= 500;
};

export { isAiServerError };
