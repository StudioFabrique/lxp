import { prisma } from "../../utils/db.ts";

export default async function getLimitedModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
  const isTeacher = await prisma.admin.findFirst({
    where: { idMdb: userMongoId },
  });

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      duration: true,
      minDate: true,
      maxDate: true,
      parcours: {
        select: {
          title: true,
          id: true,
          objectives: { select: { id: true, description: true } },
          tags: { select: { tag: true } },
        },
      },
      bonusSkills: { select: { bonusSkill: true } },
      contacts: {
        select: { contact: { select: { id: true, idMdb: true, name: true } } },
      },
      courses: {
        where: isTeacher
          ? undefined
          : { AND: [{ visibility: true }, { isPublished: true }] },
        select: {
          id: true,
          title: true,
          description: true,
          visibility: true,
          isPublished: true,
          courseSlug: true,
          tags: {
            select: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
          contacts: { select: { contact: { select: { idMdb: true } } } },
          lessons: {
            include: {
              tag: true,
              lessonsRead: {
                where: { student: { idMdb: userMongoId } },
              },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!module) {
    throw { message: "Le module n'existe pas.", statusCode: 404 };
  }

  return {
    id: module.id,
    title: module.title,
    description: module.description,
    image: module.image
      ? Buffer.from(module.image as any).toString("base64")
      : null,
    duration: module.duration,
    minDate: module.minDate,
    maxDate: module.maxDate,
    parcours: module.parcours.title,
    parcoursId: module.parcours.id,
    tags: module.parcours.tags.map(({ tag }) => tag),
    bonusSkills: module.bonusSkills.map(({ bonusSkill }) => bonusSkill),
    contacts: module.contacts.map(({ contact }) => contact),
    courses: module.courses.map(({ contacts, tags, ...course }) => ({
      ...course,
      aiIndexed: Boolean(course.courseSlug),
      contacts: contacts.map(({ contact }) => contact),
      tags: tags.map(({ tag }) => tag),
    })),
  };
}
