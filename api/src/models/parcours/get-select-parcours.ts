import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

/**
 * Récupère une liste simplifiée des parcours avec uniquement leur id et titre
 * Utilisé pour les menus déroulants et les sélecteurs de parcours
 * @returns Liste des parcours avec {id, title}
 */
export default async function getSelectParcours(
  formationId: number | null,
  scope: AccessScope = null,
) {
  const parcoursList = await prisma.parcours.findMany({
    select: { id: true, title: true },
    where: {
      ...(formationId !== null && { formationId }),
      ...(scope !== null && { id: { in: scope.parcoursIds } }),
    },
  });

  return parcoursList;
}
