import { prisma } from "../../utils/db.ts";
import {
  parcoursWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcours(scope: AccessScope = null) {
  const parcoursList = await prisma.parcours.findMany({
    where: parcoursWhereForScope(scope),
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      formation: { select: { title: true, level: true } },
      admin: { select: { idMdb: true } },
      author: true,
      isPublished: true,
      visibility: true,
      thumb: true,
    },
  });

  if (!parcoursList) {
    throw new Error(`Data not found.`);
  }
  if (parcoursList) {
    const response = parcoursList.map((parcours) => {
      const canManage =
        scope?.kind !== "teacher" ||
        scope.directParcoursIds?.includes(parcours.id);
      if (parcours.thumb && typeof parcours.thumb !== "string") {
        const base64thumb = Buffer.from(parcours.thumb as any).toString("base64");
        return { ...parcours, thumb: base64thumb, canManage };
      }
      return { ...parcours, canManage };
    });
    return response;
  }
}

export default getParcours;
