import { getAdmin } from "../../helpers/get-admin";
import { noAccess } from "../../utils/constantes";
import { prisma } from "../../utils/db";

async function putParcoursTags(
  parcoursId: number,
  newTags: Array<number>,
  userId: string
) {
  const admin = await getAdmin(userId);

  // on verifie l'existence du parcours et on récupère les tags de la formation avec laquelle il est en relation
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId, adminId: admin.id },
    include: {
      formation: {
        include: { tags: true },
      },
    },
  });

  if (!existingParcours) {
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  }

  // on créé un tableau avec les identifiants des tags de la formation
  const tagsIds = existingParcours.formation.tags.map((item) => item.tagId);

  // on ajoute les tags passés en arguments s'ils ne sont pas déjà associés à la formation
  newTags.forEach(async (newTag: number) => {
    if (!tagsIds.includes(newTag)) {
      await prisma.formation.update({
        where: { id: existingParcours.formation.id },
        data: {
          tags: {
            create: { tag: { connect: { id: newTag } } },
          },
        },
      });
    }
  });

  // on met à jour les tags du parcours
  const transaction = await prisma.$transaction(async (tx) => {
    await prisma.tagsOnParcours.deleteMany({
      where: { parcoursId },
    });

    const updatedParcours = await prisma.parcours.update({
      where: { id: parcoursId, adminId: admin.id },
      data: {
        tags: {
          create: newTags.map((tag: number) => {
            return {
              tag: {
                connect: { id: tag },
              },
            };
          }),
        },
      },
      include: { tags: true },
    });
  });
}

export default putParcoursTags;
