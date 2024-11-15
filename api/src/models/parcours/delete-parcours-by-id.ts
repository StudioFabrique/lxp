import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function deleteParcoursById(parcoursId: number, userId: string) {
  const admin = await getAdmin(userId);
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const parcours = await tx.parcours.findUnique({
        where: { id: parcoursId },
        include: { tags: true, modules: true },
      });

      if (!parcours) {
        throw {
          message: `Le parcours identifié par l'id : ${parcoursId} n'existe pas`,
          statusCode: 404,
        };
      }

      if (parcours.modules && parcours.modules.length > 0) {
        throw {
          message:
            "Des modules sont liés à ce parcours, il ne peut donc pas être supprimé. Supprimez manuellement les modules avant de reessayer.",
          statusCode: 400,
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
    return true;
  } catch (error: any) {
    throw error;
  }
}

export default deleteParcoursById;
