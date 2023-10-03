import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function deleteParcoursById(parcoursId: number, userId: string) {
  const admin = await getAdmin(userId);
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const parcours = await tx.parcours.findUnique({
        where: { id: parcoursId },
        include: { tags: true },
      });

      if (!parcours) {
        throw {
          message: `Le parcours identifié par l'id : ${parcoursId} n'existe pas`,
          status: 404,
        };
      }

      // Supprimer les enregistrements dans la table TagsOnParcours liés au parcours
      await tx.tagsOnParcours.deleteMany({
        where: { parcoursId },
      });

      // Supprimer les enregistrements dans la table TagsOnParcours liés au parcours
      await tx.contactsOnParcours.deleteMany({
        where: { parcoursId: parcoursId },
      });

      // Supprimer le parcours
      const deletedParcours = await tx.parcours.delete({
        where: { id: parcoursId, adminId: admin.id },
      });
    });
  } catch (error: any) {
    throw error;
  }
}

export default deleteParcoursById;
