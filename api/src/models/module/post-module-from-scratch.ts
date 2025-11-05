import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

/**
 * Crée un nouveau module à partir de zéro et l'associe à une formation et optionnellement à un parcours
 * @param userId - ID de l'utilisateur créant le module
 * @param title - Titre du module
 * @param description - Description du module
 * @param formationId - ID de la formation à laquelle associer le module
 * @param parcoursId - ID du parcours à laquelle associer le module (optionnel)
 * @param contactsIds - Liste des IDs des contacts à associer au module (optionnel)
 * @param bonusSkillsIds - Liste des IDs des compétences bonus à associer au module (optionnel)
 * @param duration - Durée du module
 * @param image - Image du module
 * @param thumb - Vignette du module
 * @returns {Promise<boolean>} - Retourne true si la création est réussie
 */
export default async function postModuleFromScratch(
  userId: string,
  title: string,
  description: string,
  formationId: number,
  parcoursId: number | null = null,
  contactsIds: number[] = [],
  bonusSkillsIds: number[] = [],
  duration: number,
  image: any,
  thumb: any
) {
  // Vérifie si la formation existe
  const existingFormation = await prisma.formation.findFirst({
    where: { id: formationId },
  });
  if (!existingFormation)
    throw { statusCode: 404, message: "La formation n'existe pas." };

  let existingParcours: any;

  // Si un parcours est spécifié, vérifie son existence
  if (parcoursId) {
    existingParcours = await prisma.parcours.findFirst({
      where: { id: parcoursId },
    });
    if (!existingParcours)
      throw { statusCode: 404, message: "Le parcours n'existe pas." };
  }

  // Récupère les informations de l'utilisateur depuis MongoDB
  const existingUser = await User.findOne(
    { _id: userId },
    { firstname: 1, lastname: 1 }
  );

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // Vérifie si l'utilisateur est un admin
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  // Utilise une transaction pour garantir l'intégrité des données
  await prisma.$transaction(async (tx) => {
    // Crée le module pour la formation
    const module = await tx.module.create({
      data: {
        title,
        description,
        image,
        thumb,
        author: existingUser.firstname + " " + existingUser.lastname,
        adminId: existingAdmin.id,
      },
    });

    // Associe le module à la formation
    await tx.formation.update({
      where: { id: formationId },
      data: {
        modules: {
          create: {
            module: {
              connect: {
                id: module.id,
              },
            },
          },
        },
      },
      select: { id: true },
    });

    // Si un parcours est spécifié, crée une copie du module avec des paramètres supplémentaires
    if (parcoursId && module) {
      const newModule = await tx.moduleMetadata.create({
        data: {
          duration,
          adminId: existingAdmin.id,
          moduleId: module.id,
          parcoursId: existingParcours!.id,
          // Associe les contacts au module
          contacts: {
            create: contactsIds.map((id) => ({ contact: { connect: { id } } })),
          },
          // Associe les compétences bonus au module
          bonusSkills: {
            create: bonusSkillsIds.map((id) => ({
              bonusSkill: { connect: { id } },
            })),
          },
          // Définit les dates limites basées sur le parcours
          minDate: new Date(existingParcours!.startDate!),
          maxDate: new Date(existingParcours!.endDate!),
        },
      });
    }
  });
  return true;
}
