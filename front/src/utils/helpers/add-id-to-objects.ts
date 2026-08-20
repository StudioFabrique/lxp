/**
 * Renumérote une liste d'objets à partir de 1.
 *
 * Générique sur le type des éléments, comme `sortArray` : la signature en
 * `Record<string, unknown>` que n'honore aucune interface du domaine obligeait
 * les appelants à convertir à l'aller et au retour, en perdant le type au
 * passage.
 */
export function addIdToObject<T>(items: readonly T[]): Array<T & { id: number }> {
  return items.map((item, index) => ({ ...item, id: index + 1 }));
}
