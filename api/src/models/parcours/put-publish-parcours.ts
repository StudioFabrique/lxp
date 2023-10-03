import { prisma } from "../../utils/db";

async function putPublishParcours(parcoursId: number) {
  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
  });

  if (!existingParcours) {
    const error = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw error;
  }

  const publishedParcours = await prisma.parcours.update({
    where: { id: parcoursId },
    data: {
      isPublished: true,
    },
  });
  return publishedParcours;
}

export default putPublishParcours;
