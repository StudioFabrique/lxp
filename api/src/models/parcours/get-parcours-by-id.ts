import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function getParcoursById(parcoursId: number, userId: string) {
  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId /* , adminId: admin.id */ },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      image: true,
      virtualClass: true,
      isPublished: true,
      visibility: true,
      formation: {
        select: {
          id: true,
          title: true,
          tags: {
            select: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
          level: true,
        },
      },
      tags: {
        select: { tag: { select: { id: true, name: true, color: true } } },
      },
      contacts: {
        select: {
          contact: {
            select: { id: true, idMdb: true, name: true, role: true },
          },
        },
      },
      skills: { include: { skill: true } },
      bonusSkills: { select: { id: true, description: true, badge: true } },
      objectives: { select: { id: true, description: true } },
      modules: {
        select: {
          module: {
            select: {
              id: true,
              title: true,
              description: true,
              duration: true,
              minDate: true,
              maxDate: true,
              thumb: true,
              contacts: { select: { contact: true } },
              bonusSkills: {
                select: {
                  bonusSkill: { select: { id: true, description: true } },
                },
              },
              courses: {
                select: {
                  lessons: {
                    select: {
                      lessonsRead: {
                        where: { student: { idMdb: userId } },
                        select: { id: true, finishedAt: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      groups: {
        select: {
          group: {
            select: {
              id: true,
              idMdb: true,
            },
          },
        },
      },
      admin: { select: { id: true, idMdb: true } },
    },
  });

  if (!parcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  let result: any = parcours;
  if (parcours) {
    if (parcours.image instanceof Buffer) {
      const base64Image = parcours.image.toString("base64");
      result = { ...result, image: base64Image };
    }
    if (parcours.modules) {
      const updatedModules = parcours.modules.map((item: any) => ({
        ...item,
        module: {
          ...item.module,
          thumb: item.module.thumb.toString("base64"),
        },
      }));
      result = { ...result, modules: updatedModules };
      return result;
    }
    return parcours;
  }
}

export default getParcoursById;
