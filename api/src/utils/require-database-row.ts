/** Turns Prisma's nullable single-row mutation result into an explicit failure. */
export function requireDatabaseRow<Row>(row: Row | null): Row {
  if (row === null) throw new Error("Database row not found");
  return row;
}
