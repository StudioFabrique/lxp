import { prisma } from "../../utils/db";

export default async function getLimitedModuleDetail(
  moduleId: number,
  userMongoId: string
) {
  // First check if user is admin/teacher
  const isTeacher = await prisma.admin.findFirst({
    where: { idMdb: userMongoId },
  });

  const existingModule = await prisma.moduleMetadata.findFirst({
    where: { id: moduleId },
    select: {
      id: true,
      duration: true,
      minDate: true,
      maxDate: true,
      module: {
        select: { title: true, description: true, image: true, id: true },
      },
      parcours: {
        select: { title: true, id: true },
      },
      bonusSkills: { select: { bonusSkill: true } },
      contacts: { select: { contact: true } },
      courses: {
        where: isTeacher
          ? undefined
          : {
              AND: [{ visibility: true }, { isPublished: true }],
            },
        select: {
          id: true,
          title: true,
          description: true,
          visibility: true,
          isPublished: true,
          lessons: {
            // where: isTeacher
            //   ? undefined
            //   : {
            //       AND: [{ visibility: true }, { isPublished: true }],
            //     },
            include: {
              lessonsRead: {
                where: { student: { idMdb: userMongoId } },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!existingModule) {
    const error: any = { message: "Le module n'existe pas.", statusCode: 404 };
    throw error;
  }

  const result = {
    id: existingModule.id,
    title: existingModule.module.title,
    description: existingModule.module.description,
    image: existingModule.module.image?.toString("base64") ?? null,
    duration: existingModule.duration,
    minDate: existingModule.minDate,
    maxDate: existingModule.maxDate,
    parcours: existingModule.parcours.title,
    parcoursId: existingModule.parcours.id,
    bonusSkills: existingModule.bonusSkills.map((item) => item.bonusSkill),
    contacts: existingModule.contacts.map((item) => item.contact),
    courses: existingModule.courses,
  };

  return result;
}
