import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function updateParcoursInfos(
  parcoursId: number,
  title: string,
  description: string,
  formation: number,
  userId: string
) {
  try {
    const admin = await getAdmin(userId);
    const updatedParcours = await prisma.parcours.update({
      where: { id: parcoursId, adminId: admin.id },
      data: {
        title: title,
        description: description,
        formation: {
          connect: { id: formation },
        },
      },
    });
    if (updatedParcours) {
      return updatedParcours;
    }
    throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
  } catch (error: any) {
    throw error;
  }
}

export default updateParcoursInfos;
