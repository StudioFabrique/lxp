import { prisma } from "../../utils/db.ts";
import type { IndicatorContext } from "./types.ts";

/** Fenêtre par défaut, alignée sur celle de `get-user-data`. */
export const DEFAULT_WINDOW_DAYS = 30;

/**
 * Résout une fois pour toutes ce dont tous les indicateurs ont besoin.
 *
 * La correspondance Mongo → PostgreSQL est faite ici plutôt que dans chaque
 * indicateur : sinon un appel groupé referait la même requête onze fois.
 */
export default async function resolveIndicatorContext(
  userIdMdb: string,
  from?: Date,
  to?: Date,
): Promise<IndicatorContext> {
  const student = await prisma.student.findUnique({
    where: { idMdb: userIdMdb },
    select: { id: true },
  });

  const resolvedTo = to ?? new Date();
  const resolvedFrom =
    from ??
    new Date(resolvedTo.getTime() - DEFAULT_WINDOW_DAYS * 24 * 3600 * 1000);

  return {
    userIdMdb,
    studentId: student?.id ?? null,
    from: resolvedFrom,
    to: resolvedTo,
  };
}
