import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function putPublishParcours(parcoursId: number, isPublished: boolean) {
  const existingParcours = await prisma.orm.public.Parcours.where({
    id: parcoursId,
  }).first();

  if (!existingParcours) {
    const error = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw error;
  }

  // Un parcours publié doit avoir au moins un groupe d'apprenants : sans groupe, personne n'y accède.
  // Le brouillon (isPublished = false) reste toujours possible.
  if (isPublished) {
    const linkedGroup = await prisma.orm.public.GroupsOnParcours.where({
      parcoursId,
    }).first();
    if (!linkedGroup) {
      const error = {
        message:
          "Le parcours doit avoir au moins un groupe d'apprenants rattaché pour être publié",
        statusCode: 409,
      };
      throw error;
    }
  }

  const publishedParcours = await prisma.orm.public.Parcours.where({
    id: parcoursId,
  })
    .update({
      isPublished,
    })
    .then(requireDatabaseRow);
  return publishedParcours;
}

export default putPublishParcours;
