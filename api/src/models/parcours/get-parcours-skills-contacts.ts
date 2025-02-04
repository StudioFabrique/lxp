import { prisma } from "../../utils/db";

/**
 * Récupère les contacts et compétences associés à un parcours spécifique
 * @param parcoursId - L'identifiant du parcours
 * @returns Un objet contenant les contacts et compétences du parcours
 * @throws {Object} Une erreur avec un code 404 si le parcours n'existe pas
 */
export default async function getParcoursSkillsContacts(parcoursId: number) {
  // Recherche du parcours avec ses relations contacts et compétences
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
    select: {
      contacts: {
        select: {
          contact: {
            select: {
              id: true,
              idMdb: true,
              name: true,
              role: true,
            },
          },
        },
      },
      bonusSkills: {
        select: {
          id: true,
          description: true,
        },
      },
    },
  });

  // Vérifie si le parcours existe
  if (!existingParcours)
    throw { statusCode: 404, message: "Parcours non trouvé." };

  // Formate les données pour la réponse
  const data = {
    contacts: existingParcours.contacts.map((item) => item.contact), // Extrait les contacts
    skills: existingParcours.bonusSkills, // Récupère les compétences
  };

  return data;
}
