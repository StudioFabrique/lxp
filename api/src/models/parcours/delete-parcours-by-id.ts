import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function deleteParcoursById(parcoursId: number, userId: string) {
  const admin = await getAdmin(userId);
  try {
    let title = "";
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

      const existingAuthor = await tx.admin.findFirst({
        where: {
          id: parcours.adminId,
        },
      });
      // retourne une erreur si l'utilisateur n'est pas l'auteur du parcours
      if (existingAuthor?.idMdb !== userId)
        throw {
          statusCode: 406,
          message: "Vous n'êtes pas autorisé à supprimer ce parcours.",
        };

      title = parcours.title;

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

      await tx.bonusSkill.deleteMany({
        where: { parcoursId },
      });

      await tx.objective.deleteMany({
        where: { parcoursId },
      });

      await tx.groupsOnParcours.deleteMany({
        where: { parcoursId },
      });

      // Supprimer le parcours
      const deletedParcours = await tx.parcours.delete({
        where: { id: parcoursId, adminId: admin.id },
      });
    });
    return title;
  } catch (error: any) {
    console.log({ error });

    throw error;
  }
}

export default deleteParcoursById;
