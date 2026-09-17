import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";

async function updateParcoursDates(
  parcoursId: number,
  start: string,
  end: string,
  userId: string,
) {
  const admin = await getAdmin(userId);
  const startDate = new Date(start);
  const endDate = new Date(end);

  const existingParcours = await prisma.orm.public.Parcours.where({
    id: parcoursId /* adminId: admin.id */,
  }).first();

  if (!existingParcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const updatedDates = await prisma.orm.public.Parcours.where({
    id: parcoursId /* adminId: admin.id */,
  })
    .update({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
    .then(requireDatabaseRow);
  if (updatedDates) {
    return updatedDates;
  }
  throw { message: "Vous n'avez pas accès à cette ressource", status: 403 };
}

export default updateParcoursDates;
