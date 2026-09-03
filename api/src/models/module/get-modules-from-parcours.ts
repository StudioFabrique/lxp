import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

async function getModulesFromParcours(
  parcoursId: number,
  scope: AccessScope = null,
) {
  const parcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      modules: {
        where: moduleWhereForScope(scope),
        select: {
          id: true,
          title: true,
          thumb: true,
          description: true,
          quizInstructions: true,
          duration: true,
          contacts: {
            select: {
              contact: { select: { id: true, idMdb: true, role: true } },
            },
          },
          bonusSkills: {
            select: {
              bonusSkill: { select: { id: true, description: true } },
            },
          },
        },
      },
      formation: { select: { id: true } },
      contacts: {
        select: {
          contact: { select: { id: true, idMdb: true, role: true } },
        },
      },
      bonusSkills: true,
    },
  });

  if (!parcours) throw { statusCode: 404, message: "Parcours introuvable." };
  const namedContacts = await enrichContactsWithNames([
    ...parcours.contacts.map(({ contact }) => contact),
    ...parcours.modules.flatMap(({ contacts }) =>
      contacts.map(({ contact }) => contact),
    ),
  ]);
  const contactsByMongoId = new Map(
    namedContacts.map((contact) => [contact.idMdb, contact]),
  );

  return {
    modules: parcours.modules.map(({ contacts, bonusSkills, ...module }) => {
      const thumb = module.thumb
        ? Buffer.from(module.thumb as any).toString("base64")
        : null;
      return {
        ...module,
        thumb,
        contacts: contacts.map(
          ({ contact }) => contactsByMongoId.get(contact.idMdb)!,
        ),
        skills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
      };
    }),
    parcoursData: {
      formationId: parcours.formation.id,
      contacts: parcours.contacts.map(
        ({ contact }) => contactsByMongoId.get(contact.idMdb)!,
      ),
      bonusSkills: parcours.bonusSkills,
    },
  };
}

export default getModulesFromParcours;
