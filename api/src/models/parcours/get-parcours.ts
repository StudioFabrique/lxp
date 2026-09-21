import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcours(scope: AccessScope = null) {
  const query = scope
    ? prisma.orm.public.Parcours.where((row) => row.id.in(scope.parcoursIds))
    : prisma.orm.public.Parcours;
  const parcoursList = await query
    .select(
      "id",
      "title",
      "createdAt",
      "updatedAt",
      "author",
      "isPublished",
      "thumb",
    )
    .include("formation", (related240) => related240.select("title", "level"))
    .include("admin", (related241) => related241.select("idMdb"))
    .all();

  if (!parcoursList) {
    throw new Error(`Data not found.`);
  }
  if (parcoursList) {
    const response = parcoursList.map((parcours) => {
      const canManage =
        scope?.kind !== "teacher" ||
        scope.directParcoursIds?.includes(parcours.id);
      if (parcours.thumb && typeof parcours.thumb !== "string") {
        const base64thumb = Buffer.from(parcours.thumb as any).toString(
          "base64",
        );
        return { ...parcours, thumb: base64thumb, canManage };
      }
      return { ...parcours, canManage };
    });
    return response;
  }
}

export default getParcours;
