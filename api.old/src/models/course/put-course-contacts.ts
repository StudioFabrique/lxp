import { prisma } from "../../utils/db";

async function putCourseContacts(courseId: number, contacts: number[]) {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId },
  });

  if (!existingCourse) {
    const error = new Error("Le cours n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.contactsOnCourse.deleteMany({
      where: { courseId },
    });

    const upadtedCourse = await tx.course.update({
      where: { id: courseId },
      data: {
        contacts: {
          create: contacts.map((contact: number) => {
            return {
              contact: {
                connect: {
                  id: contact,
                },
              },
            };
          }),
        },
      },
    });
  });
  return transaction;
}

export default putCourseContacts;
