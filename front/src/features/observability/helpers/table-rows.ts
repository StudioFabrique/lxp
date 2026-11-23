export type WithId<T> = T & { id: string };

/**
 * `DataTable` identifie chaque ligne par son `id`. Les lignes de journaux n'en
 * ont pas : l'index garantit l'unicité même si deux événements ont le même horodatage.
 */
export function withIds<T>(rows: T[], key: (row: T) => string): WithId<T>[] {
  return rows.map((row, index) => ({ ...row, id: `${key(row)}-${index}` }));
}
