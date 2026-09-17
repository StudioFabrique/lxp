import type { Contact } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";

export default async function getLessonDetail(
  lessonId: number,
  userIdMdb?: string,
) {
  let existingLesson = (await prisma.orm.public.Lesson.where({ id: lessonId })
    .select("id", "title", "courseId")
    .include("course", (related117) =>
      related117
        .select("id", "title", "image")
        .include("contacts", (related118) =>
          related118.include("contact", (related119) =>
            related119.select("idMdb"),
          ),
        ),
    )
    .include("activities", (related120) =>
      related120
        .select("id", "type", "order", "url", "title", "createdAt", "updatedAt")
        .include("resourceActivities")
        .orderBy((row) => row.order.asc()),
    )
    .include("lessonRating", (related121) =>
      userIdMdb
        ? related121.where((row) =>
            row.student.some((student) => student.idMdb.eq(userIdMdb)),
          )
        : related121,
    )
    .include("lessonsRead", (related122) =>
      userIdMdb
        ? related122.where((row) =>
            row.student.some((student) => student.idMdb.eq(userIdMdb)),
          )
        : related122,
    )
    .first()) as any;

  if (!existingLesson) {
    const error = new Error("La leçon n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  if (existingLesson.course && existingLesson.course.image) {
    if (existingLesson.course.image instanceof Buffer) {
      const base64Image = existingLesson.course.image.toString("base64");
      existingLesson = {
        ...existingLesson,
        course: {
          ...existingLesson.course,
          image: base64Image,
        },
      };
    }
  }

  if (!existingLesson.activities || existingLesson.activities === undefined) {
    existingLesson = {
      ...existingLesson,
      activities: [],
    };
  }

  return {
    ...existingLesson,
    course: {
      contacts: existingLesson.course.contacts.map(
        (contact: { contact: Contact }) => contact.contact,
      ),
    },
  };
}
