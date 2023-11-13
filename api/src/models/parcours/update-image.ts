import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function updateImage(parcoursId: number, image: any, thumb: any) {
  const result = await prisma.parcours.update({
    where: {
      id: parcoursId,
    },
    data: {
      image,
      thumb,
    },
  });
  if (!result) {
    const error = new Error("Le parcours n'existe pas");
    (error as any).status = 404;
    throw error;
  }

  return result;
}

export default updateImage;
