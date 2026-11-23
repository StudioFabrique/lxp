const labels: Record<string, string> = {
  "400": "Requête invalide",
  "401": "Non authentifié",
  "403": "Accès refusé",
  "404": "Introuvable",
  "409": "Conflit",
  "413": "Fichier trop volumineux",
  "422": "Données refusées",
  "429": "Trop de tentatives",
  "500": "Erreur interne",
  "502": "Service amont indisponible",
  "503": "Service indisponible",
  "504": "Délai dépassé",
};

/** Explique un code HTTP en français ; un code inconnu reste affiché tel quel. */
export function statusLabel(status: string | number): string {
  return labels[String(status)] ?? `Code ${status}`;
}
