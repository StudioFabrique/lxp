import { prisma } from "../../utils/db";

export default async function getModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
  console.log(moduleId);
  const existingModule = await prisma.module.findFirst({
    where: { id: moduleId },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      duration: true,
      minDate: true,
      maxDate: true,
      parcours: { select: { parcours: { select: { title: true } } } },
      bonusSkills: { select: { bonusSkill: true } },
      contacts: { select: { contact: true } },
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          lessons: { include: { lessonsRead: { include: { student: true } } } },
        },
      },
    },
  });

  if (!existingModule) {
    const error: any = { message: "Le module n'existe pas.", statusCode: 404 };
    throw error;
  }

  const courses = existingModule.courses.map((course) => {
    course.lessons = course.lessons.map((lesson) => {
      lesson.lessonsRead = lesson.lessonsRead.filter(
        (lessonRead) =>
          lessonRead.student.idMdb === userMongoId && lessonRead.finishedAt,
      );

      return lesson;
    });

    return course;
  });

  const result = {
    id: existingModule.id,
    title: existingModule.title,
    description: existingModule.description,
    image: existingModule.image?.toString("base64") ?? null,
    duration: existingModule.duration,
    minDate: existingModule.minDate,
    maxDate: existingModule.maxDate,
    parcours: existingModule.parcours[0].parcours.title,
    bonusSkills: existingModule.bonusSkills.map((item) => item.bonusSkill),
    contacts: existingModule.contacts.map((item) => item.contact),
    courses: courses,
  };

  return result;
}
