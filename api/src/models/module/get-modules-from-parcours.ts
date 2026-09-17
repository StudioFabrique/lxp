import { whereFromObject } from "../../utils/prisma-query.ts";
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
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: +parcoursId }),
  )
    .include("modules", (related183) =>
      related183
        .where((row) => whereFromObject(row, moduleWhereForScope(scope)))
        .select(
          "id",
          "title",
          "thumb",
          "description",
          "quizInstructions",
          "duration",
        )
        .include("contacts", (related184) =>
          related184.include("contact", (related185) =>
            related185.select("id", "idMdb", "role"),
          ),
        )
        .include("bonusSkills", (related186) =>
          related186.include("bonusSkill", (related187) =>
            related187.select("id", "description", "badge"),
          ),
        ),
    )
    .include("formation", (related188) => related188.select("id"))
    .include("contacts", (related189) =>
      related189.include("contact", (related190) =>
        related190.select("id", "idMdb", "role"),
      ),
    )
    .include("bonusSkills")
    .first();

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
        contacts: contacts.map(({ contact }) =>
          contactsByMongoId.get(contact!.idMdb)!,
        ),
        skills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
      };
    }),
    parcoursData: {
      formationId: parcours.formation!.id,
      contacts: parcours.contacts.map(({ contact }) =>
        contactsByMongoId.get(contact!.idMdb)!,
      ),
      bonusSkills: parcours.bonusSkills,
    },
  };
}

export default getModulesFromParcours;
