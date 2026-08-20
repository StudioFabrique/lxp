/**
 * Compare deux valeurs de type inconnu pour un tri.
 *
 * Les colonnes triables portent des chaînes, des nombres ou des dates : les
 * comparer directement avec `<` obligerait à taire leur type, et trierait les
 * dates comme du texte.
 */
function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  return String(a).localeCompare(String(b), "fr", { numeric: true });
}

/**
 * Trie une copie du tableau selon l'une de ses propriétés.
 *
 * Générique sur le type des éléments : la signature précédente exigeait un
 * `Record<string, unknown>`, que ne satisfait aucune des interfaces du domaine.
 * Chaque appelant devait donc convertir son tableau à l'aller et au retour, ce
 * qui faisait perdre le type des éléments au passage.
 */
export const sortArray = <T>(
  tab: readonly T[],
  property: keyof T & string,
  direction = true,
): T[] => {
  const sortedArray = [...tab];
  const sign = direction ? 1 : -1;

  sortedArray.sort((a, b) => sign * compareValues(a[property], b[property]));

  return sortedArray;
};
