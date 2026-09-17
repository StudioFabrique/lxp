import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma, type NestedConnect } from "../../utils/db.ts";

async function putCourseContacts(courseId: number, contacts: number[]) {
  const existingCourse = await prisma.orm.public.Course.where({
    id: courseId,
  }).first();

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.transaction(async (tx) => {
    await tx.orm.public.ContactsOnCourse.where({ courseId })
      .deleteAndCount()
      .then((count) => ({ count }));

    const updatedCourse = await tx.orm.public.Course.where({ id: courseId })
      .update({
        contacts: (relation) =>
          relation.create(
            contacts.map((contact: number) => {
              return {
                contact: (contactRelation: NestedConnect<"Contact">) =>
                  contactRelation.connect({ id: contact }),
              };
            }),
          ),
      })
      .then(requireDatabaseRow);
    return updatedCourse;
  });
  return transaction;
}

export default putCourseContacts;
