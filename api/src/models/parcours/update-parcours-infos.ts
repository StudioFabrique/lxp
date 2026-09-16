import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { getAdmin } from "../../helpers/get-admin.ts";
import { prisma } from "../../utils/db.ts";

async function updateParcoursInfos(
  parcoursId: number,
  title: string,
  description: string,
  formation: number,
) {
  const existingParcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  ).first();

  const existingFormation = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(row, { id: formation }),
  ).first();

  if (!existingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  if (!existingParcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const updatedParcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .update({
      title: title,
      description: description,
      isPublished: existingParcours.isPublished,
      formation: (relation) => relation.connect({ id: formation }),
    })
    .then(requireDatabaseRow);

  return updatedParcours;
}

export default updateParcoursInfos;
