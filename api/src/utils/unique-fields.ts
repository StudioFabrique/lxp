/**
 * Contrôles d'unicité insensibles à la casse.
 *
 * Les emails et les noms de groupe n'ont pas été normalisés de la même façon
 * selon le point d'entrée : la création unitaire passe l'email en minuscules,
 * l'import CSV et la création de contact l'enregistrent tel quel. Une
 * comparaison stricte laissait donc « Jean@Mail.fr » s'ajouter à côté de
 * « jean@mail.fr », et « Promo 2025 » à côté de « promo 2025 ». La comparaison
 * se fait sur la valeur entière, sans tenir compte de la casse ni des espaces
 * de bordure.
 */

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Expression Mongo correspondant exactement à `value`, à la casse près.
 * Ancrée des deux côtés : « promo » ne doit pas correspondre à « promo 2025 ».
 */
export function exactInsensitive(value: string) {
  return new RegExp(`^${escapeRegExp(value.trim())}$`, "i");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/**
 * L'index unique sur `email` reste le dernier rempart : deux créations
 * simultanées passent toutes les deux la vérification préalable. Sans cette
 * traduction, la seconde remontait en 500 avec le message brut de MongoDB.
 */
export function isDuplicateKeyError(error: any) {
  return error?.code === 11000 || error?.code === 11001;
}
