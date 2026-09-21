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
