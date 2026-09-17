import { and } from "@prisma/orm-postgres/orm-client";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export default async function getModulesFormation(
  formationId: number,
  scope: AccessScope = null,
) {
  const modules = await prisma.orm.public.Module.where((row) =>
    and(
      row.parcours.some((parcours) => parcours.formationId.eq(formationId)),
      ...(scope
        ? [
            scope.moduleIds === null
              ? row.parcoursId.in(scope.parcoursIds)
              : row.id.in(scope.moduleIds),
          ]
        : []),
    ),
  )
    .select(
      "id",
      "title",
      "quizInstructions",
      "description",
      "thumb",
      "duration",
    )
    .include("parcours", (related176) => related176.select("id", "title"))
    .include("courses", (related177) =>
      related177
        .select("id", "title", "courseSlug")
        .include("lessons", (related178) => related178.select("id", "title")),
    )
    .include("contacts", (related179) =>
      related179.include("contact", (related180) =>
        related180.select("id", "idMdb", "role"),
      ),
    )
    .include("bonusSkills", (related181) =>
      related181.include("bonusSkill", (related182) =>
        related182.select("id", "description", "badge"),
      ),
    )
    .orderBy((row) => row.createdAt.asc())
    .all();
  const namedContacts = await enrichContactsWithNames(
    modules.flatMap(({ contacts }) => contacts.map(({ contact }) => contact)),
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
      contacts: contacts.map(({ contact }) =>
        contactsByMongoId.get(contact!.idMdb)!,
      ),
      bonusSkills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
      courses: courses.map((course) => ({
        ...course,
        aiIndexed: Boolean(course.courseSlug),
      })),
    };
  });
}
