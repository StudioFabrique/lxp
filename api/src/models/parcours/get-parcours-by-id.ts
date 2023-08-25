import { getAdmin } from "../../helpers/get-admin";
import { noAccess } from "../../utils/constantes";
import { prisma } from "../../utils/db";

async function getParcoursById(parcoursId: number, userId: string) {
  try {
    const admin = await getAdmin(userId);

    const parcours = await prisma.parcours.findFirst({
      where: { id: parcoursId, adminId: admin.id },
      select: {
        id: true,
        title: true,
        description: true,
        startDate: true,
        endDate: true,
        image: true,
        virtualClass: true,
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
        admin: { select: { id: true, idMdb: true } },
      },
    });

    if (parcours) {
      if (parcours.image instanceof Buffer) {
        const base64Image = parcours.image.toString("base64");
        const result = { ...parcours, image: base64Image };
        return result;
      }

      return parcours;
    }
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  } catch (error: any) {
    throw error;
  }
}

export default getParcoursById;
