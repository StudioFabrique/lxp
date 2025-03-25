import { prisma } from "../../utils/db";

export default async function getModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
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
      parcours: {
        select: { parcours: { select: { title: true } }, parcoursId: true },
      },
      bonusSkills: { select: { bonusSkill: true } },
      contacts: { select: { contact: true } },
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          lessons: {
            include: {
              lessonsRead: {
                where: { student: { idMdb: userMongoId } },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
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
    title: existingModule.title,
    description: existingModule.description,
    image: existingModule.image?.toString("base64") ?? null,
    duration: existingModule.duration,
    minDate: existingModule.minDate,
    maxDate: existingModule.maxDate,
    parcours: existingModule.parcours[0].parcours.title,
    parcoursId: existingModule.parcours[0].parcoursId,
    bonusSkills: existingModule.bonusSkills.map((item) => item.bonusSkill),
    contacts: existingModule.contacts.map((item) => item.contact),
    courses: existingModule.courses,
  };

  return result;
}
