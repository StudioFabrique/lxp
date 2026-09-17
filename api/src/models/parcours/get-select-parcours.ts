import { and } from "@prisma/orm-postgres/orm-client";
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
  const parcoursList = await prisma.orm.public.Parcours.where((row) =>
    and(
      ...(formationId === null ? [] : [row.formationId.eq(formationId)]),
      ...(scope ? [row.id.in(scope.parcoursIds)] : []),
    ),
  )
    .select("id", "title")
    .all();

  return parcoursList;
}
