import { prisma } from "../../utils/db.ts";
import { getAccessibleParcoursIds } from "../../utils/services/permissions/accessible-parcours.ts";

async function getParcoursByStudent(studentId: string) {
  // La résolution « apprenant → groupes Mongo → parcours PostgreSQL » est
  // partagée avec le contrôle d'accès aux contenus : les deux doivent voir
  // exactement le même périmètre, sinon un parcours listé ici deviendrait
  // illisible une fois ouvert.
  const accessibleParcoursIds = await getAccessibleParcoursIds(studentId);

  const parcoursList = await prisma.orm.public.Parcours.where((row) =>
    row.id.in(accessibleParcoursIds),
  )
    .select(
      "id",
      "title",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
      "author",
      "isPublished",
      "visibility",
      "thumb",
    )
    .include("formation", (related235) =>
      related235.select("id", "title", "level"),
    )
    .include("admin", (related236) => related236.select("idMdb"))
    .all();

  if (!parcoursList) {
    throw new Error(`Data not found.`);
  }
  if (parcoursList) {
    const response = parcoursList.map((parcours) => {
      if (parcours.thumb && typeof parcours.thumb !== "string") {
        const base64thumb = Buffer.from(parcours.thumb as any).toString(
          "base64",
        );
        return { ...parcours, thumb: base64thumb };
      }
      return parcours;
    });
    return response;
  }
}

export default getParcoursByStudent;
