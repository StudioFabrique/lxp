/**
 * Génère un tableau qui contient une liste de nombres comptés jusqu'au
 * maximum de pages avec une incrémentation spécifiée.
 *
 * @param number - Le nombre maximum (nombre de pages)
 * @param increment - L'incrément entre chaque nombre (par défaut: 1)
 * @returns Un tableau de nombres
 *
 * @example
 * Retourne [1, 5, 10, 15, 16]
 * iterateNumberToArray(16, 5)
 */
export default function iterateNumberToArray(
  number: number,
  increment: number = 1,
): Array<number> {
  const array: number[] = [1];

  for (let i = increment; i <= number; i += increment) {
    array.push(i);
  }

  return [...new Set([...array, number])];
}
