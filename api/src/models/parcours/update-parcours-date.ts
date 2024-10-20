import { getAdmin } from "../../helpers/get-admin";
import { prisma } from "../../utils/db";

async function updateParcoursDates(
  parcoursId: number,
  start: string,
  end: string,
  userId: string,
) {
  const admin = await getAdmin(userId);
  const startDate = new Date(start);
  const endDate = new Date(end);

  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId /* adminId: admin.id */ },
  });

  if (!existingParcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const updatedDates = await prisma.parcours.update({
    where: { id: parcoursId /* adminId: admin.id */ },
    data: {
      startDate,
      endDate,
    },
  });
  if (updatedDates) {
    return updatedDates;
  }
  throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
}

export default updateParcoursDates;
