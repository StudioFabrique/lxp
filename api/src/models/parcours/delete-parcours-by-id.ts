import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteParcoursById(parcoursId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      const parcours = await tx.parcours.findUnique({
        where: { id: parcoursId },
        include: { tags: true },
      });

      if (!parcours) {
        throw new Error(
          `Le parcours identifié par l'id : ${parcoursId} n'existe pas`
        );
      }

      // Supprimer les enregistrements dans la table TagsOnParcours liés au parcours
      await tx.tagsOnParcours.deleteMany({
        where: { parcoursId: parcoursId },
      });

      // Supprimer les enregistrements dans la table TagsOnParcours liés au parcours
      await tx.contactsOnParcours.deleteMany({
        where: { parcoursId: parcoursId },
      });

      // Supprimer le parcours
      await tx.parcours.delete({
        where: { id: parcoursId },
      });
    });

    return true; // ou une autre valeur pour indiquer que la suppression a réussi
  } catch (error: any) {
    // Gérer l'erreur si nécessaire
    throw new Error(
      "Erreur lors de la suppression du parcours : " + error.message
    );
  }
}

export default deleteParcoursById;
