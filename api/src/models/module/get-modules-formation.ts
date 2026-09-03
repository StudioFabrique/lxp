import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getModulesFormation(
  formationId: number,
  scope: AccessScope = null,
) {
  const modules = await prisma.module.findMany({
    where: {
      parcours: { formationId },
      ...(moduleWhereForScope(scope) ?? {}),
    },
    orderBy: [{ parcours: { title: "asc" } }, { createdAt: "asc" }],
    select: {
      id: true,
      title: true,
      quizInstructions: true,
      description: true,
      thumb: true,
      duration: true,
      parcours: { select: { id: true, title: true } },
      courses: {
        select: {
          id: true,
          title: true,
          courseSlug: true,
          lessons: { select: { id: true, title: true } },
        },
      },
      contacts: {
        select: {
          contact: { select: { id: true, idMdb: true, role: true } },
        },
      },
      bonusSkills: {
        select: { bonusSkill: { select: { id: true, description: true } } },
      },
    },
  });
  const namedContacts = await enrichContactsWithNames(
    modules.flatMap(({ contacts }) =>
      contacts.map(({ contact }) => contact),
    ),
  );
  const contactsByMongoId = new Map(
    namedContacts.map((contact) => [contact.idMdb, contact]),
  );

  return modules.map(({ contacts, bonusSkills, courses, ...module }) => {
    const thumb = module.thumb
      ? Buffer.from(module.thumb as any).toString("base64")
      : null;
    return {
      ...module,
      thumb,
      contacts: contacts.map(
        ({ contact }) => contactsByMongoId.get(contact.idMdb)!,
      ),
      bonusSkills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
      courses: courses.map((course) => ({
        ...course,
        aiIndexed: Boolean(course.courseSlug),
      })),
    };
  });
}
