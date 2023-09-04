import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function updateImage(parcoursId: number, image: any, userId: string) {
  try {
    const admin = await getAdmin(userId);
    const result = await prisma.parcours.update({
      where: {
        id: parcoursId,
        adminId: admin.id,
      },
      data: {
        image,
      },
    });
    if (!result) {
      throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export default updateImage;
