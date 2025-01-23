import { prisma } from "../../utils/db";

/**
 * Récupère la liste des parcours associés à une formation
 * @param formationId Identifiant de la formation
 * @returns Liste des parcours associés avec leur id et titre
 */
export default async function getParcoursListFromFormation(
  formationId: number
): Promise<{ id: number; title: string }[]> {
  // Vérifie l'existence de la formation
  const existingFormation = await prisma.formation.findFirst({
    where: {
      id: formationId,
    },
  });

  if (!existingFormation) {
    // Si la formation n'existe pas, lance une erreur 404
    throw { statusCode: 404, message: "La formation n'existe pas." };
  }

  // Récupère la liste des parcours associés à la formation
  const parcours = await prisma.parcours.findMany({
    where: {
      formationId,
    },
    select: {
      id: true,
      title: true,
    },
  });

  // Retourne la liste des parcours
  return parcours;
}
