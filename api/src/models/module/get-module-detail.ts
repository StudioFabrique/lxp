import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";

export default async function getModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
  const module = await prisma.orm.public.Module.where({ id: moduleId })
    .select(
      "id",
      "title",
      "description",
      "image",
      "duration",
      "minDate",
      "maxDate",
    )
    .include("parcours", (related170) => related170.select("id", "title"))
    .include("bonusSkills", (related171) => related171.include("bonusSkill"))
    .include("contacts", (related172) => related172.include("contact"))
    .include("courses", (related173) =>
      related173
        .select("id", "title", "description", "courseSlug")
        .include("lessons", (related174) =>
          related174
            .include("lessonsRead", (related175) =>
              related175.where((row) =>
                row.student.some((student) => student.idMdb.eq(userMongoId)),
              ),
            )
            .orderBy((row) => row.order.asc()),
        )
        .orderBy((row) => row.order.asc()),
    )
    .first();

  if (!module) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }

  const { bonusSkills, contacts, parcours, ...flatModule } = module;
  const namedContacts = await enrichContactsWithNames(
    contacts.map(({ contact }) => contact),
  );
  return {
    ...flatModule,
    image: module.image
      ? Buffer.from(module.image as any).toString("base64")
      : null,
    parcours: parcours!.title,
    parcoursId: parcours!.id,
    bonusSkills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
    contacts: namedContacts,
    courses: module.courses.map((course) => ({
      ...course,
      aiIndexed: Boolean(course.courseSlug),
    })),
  };
}
