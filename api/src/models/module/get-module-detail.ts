import { prisma } from "../../utils/db";

export default async function getModuleDetail(
  moduleId: number,
  userMongoId: string,
) {
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
      parcours: { select: { id: true, title: true } },
      bonusSkills: { select: { bonusSkill: true } },
      contacts: { select: { contact: true } },
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          courseSlug: true,
          lessons: {
            include: {
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

  const { bonusSkills, contacts, parcours, ...flatModule } = module;
  return {
    ...flatModule,
    image: module.image
      ? Buffer.from(module.image as any).toString("base64")
      : null,
    parcours: parcours.title,
    parcoursId: parcours.id,
    bonusSkills: bonusSkills.map(({ bonusSkill }) => bonusSkill),
    contacts: contacts.map(({ contact }) => contact),
    courses: module.courses.map((course) => ({
      ...course,
      aiIndexed: Boolean(course.courseSlug),
    })),
  };
}
