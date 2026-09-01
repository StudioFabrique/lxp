import { prisma } from "../../utils/db.ts";
import { getAccessibleParcoursIds } from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcoursByStudent(studentId: string) {
  // La résolution « apprenant → groupes Mongo → parcours PostgreSQL » est
  // partagée avec le contrôle d'accès aux contenus : les deux doivent voir
  // exactement le même périmètre, sinon un parcours listé ici deviendrait
  // illisible une fois ouvert.
  const accessibleParcoursIds = await getAccessibleParcoursIds(studentId);

  const parcoursList = await prisma.parcours.findMany({
    where: { id: { in: accessibleParcoursIds } },
    select: {
      id: true,
      title: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      updatedAt: true,
      formation: { select: { id: true, title: true, level: true } },
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
      if (parcours.thumb && typeof parcours.thumb !== "string") {
        const base64thumb = Buffer.from(parcours.thumb as any).toString("base64");
        return { ...parcours, thumb: base64thumb };
      }
      return parcours;
    });
    return response;
  }
}

export default getParcoursByStudent;
