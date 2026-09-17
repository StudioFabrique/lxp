import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";

async function getCourseInformations(courseId: number) {
  const course = await prisma.orm.public.Course.where({ id: courseId })
    .select(
      "id",
      "title",
      "description",
      "virtualClass",
      "visibility",
      "isPublished",
    )
    .include("tags", (related34) => related34.include("tag"))
    .include("contacts", (related35) => related35.include("contact"))
    .include("module", (related36) =>
      related36
        .select(
          "id",
          "minDate",
          "maxDate",
          "duration",
          "title",
          "description",
          "image",
        )
        .include("contacts", (related37) =>
          related37.include("contact", (related38) =>
            related38.select("id", "idMdb", "role"),
          ),
        )
        .include("parcours", (related39) =>
          related39
            .select("id", "title", "virtualClass")
            .include("formation", (related40) =>
              related40
                .select("id", "title")
                .include("tags", (related41) => related41.include("tag")),
            )
            .include("tags", (related42) =>
              related42.include("tag", (related43) =>
                related43.select("id", "color", "name"),
              ),
            ),
        ),
    )
    .first();

  if (!course) throw { message: "Le cours n'existe pas.", statusCode: 404 };
  const namedContacts = await enrichContactsWithNames([
    ...course.contacts.map(({ contact }) => contact),
    ...course.module!.contacts.map(({ contact }) => contact),
  ]);
  const contactsByMongoId = new Map(
    namedContacts.map((contact) => [contact.idMdb, contact]),
  );

  return {
    ...course,
    contacts: course.contacts.map(({ contact }) => ({
      contact: contactsByMongoId.get(contact!.idMdb)!,
    })),
    module: {
      ...course.module,
      contacts: course.module!.contacts.map(({ contact }) => ({
        contact: contactsByMongoId.get(contact!.idMdb)!,
      })),
      image: course.module!.image
        ? Buffer.from(course.module!.image as any).toString("base64")
        : null,
    },
  };
}

export default getCourseInformations;
