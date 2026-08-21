/**
 * Exceptions au verrou lecture seule de la démonstration.
 *
 * Le verrou refuse tout verbe autre que GET. Quelques routes y échappent parce
 * qu'elles ne modifient rien malgré leur verbe : l'API sert deux lectures en
 * POST, et l'ouverture d'une session de démonstration est elle-même un POST.
 *
 * Les chemins sont relatifs au montage `/v1`, le middleware étant monté avec
 * ce préfixe. Toute nouvelle entrée doit être une lecture démontrée, pas une
 * écriture jugée inoffensive : le test de couverture des routes échouera tant
 * que le choix n'est pas explicite.
 */
export type DemoWriteException = {
  method: string;
  pattern: RegExp;
  reason: string;
};

export const demoWriteAllowlist: DemoWriteException[] = [
  {
    method: "POST",
    pattern: /^\/demo\/session\/?$/,
    reason: "Ouverture d'une session de démonstration.",
  },
  {
    method: "POST",
    pattern: /^\/user\/group\/?$/,
    reason:
      "Lecture servie en POST (httpGetUsersByGroup) : sans elle les pages Groupes cassent.",
  },
];

export function isDemoWriteAllowed(method: string, path: string): boolean {
  return demoWriteAllowlist.some(
    (exception) =>
      exception.method === method.toUpperCase() && exception.pattern.test(path),
  );
}
