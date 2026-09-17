import { whereFromObject } from "../../utils/prisma-query.ts";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";

/**
 * Récupère les contacts et compétences associés à un parcours spécifique
 * @param parcoursId - L'identifiant du parcours
 * @returns Un objet contenant les contacts et compétences du parcours
 * @throws {Object} Une erreur avec un code 404 si le parcours n'existe pas
 */
export default async function getParcoursSkillsContacts(parcoursId: number) {
  // Recherche du parcours avec ses relations contacts et compétences
  const existingParcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .include("contacts", (related237) =>
      related237.include("contact", (related238) =>
        related238.select("id", "idMdb", "role"),
      ),
    )
    .include("bonusSkills", (related239) =>
      related239.select("id", "description"),
    )
    .first();

  // Vérifie si le parcours existe
  if (!existingParcours)
    throw { statusCode: 404, message: "Parcours non trouvé." };

  // Formate les données pour la réponse
  const contacts = await enrichContactsWithNames(
    existingParcours.contacts.map((item) => item.contact),
  );
  const data = {
    contacts,
    skills: existingParcours.bonusSkills, // Récupère les compétences
  };

  return data;
}
