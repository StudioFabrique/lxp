import { Contact } from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";

export default async function getLessonDetail(
  lessonId: number,
  userIdMdb?: string,
) {
  let existingLesson = (await prisma.lesson.findFirst({
    where: { id: lessonId },
    select: {
      id: true,
      title: true,
      course: {
        select: {
          id: true,
          title: true,
          image: true,
          contacts: { select: { contact: { select: { idMdb: true } } } },
        },
      },
      activities: {
        select: {
          id: true,
          type: true,
          order: true,
          url: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          resourceActivities: true,
        },
        orderBy: { order: "asc" },
      },
      lessonRating: { where: { student: { idMdb: userIdMdb } } },
      lessonsRead: { where: { student: { idMdb: userIdMdb } } },
    },
  })) as any;

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
