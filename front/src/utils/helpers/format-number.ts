const frenchNumberFormat = new Intl.NumberFormat("fr-FR");

/**
 * Formate un nombre à la française : espace fine insécable comme séparateur
 * de milliers (1 234 567) et virgule décimale.
 *
 * Sans options, les décimales sont limitées à 3 chiffres ; passer
 * `Intl.NumberFormatOptions` pour fixer une précision (ex. tailles de fichiers).
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return options
    ? value.toLocaleString("fr-FR", options)
    : frenchNumberFormat.format(value);
}
