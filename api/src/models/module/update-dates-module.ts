import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function updateDatesModule(
  moduleId: number,
  minDate: string,
  maxDate: string,
) {
  const module = await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, { id: +moduleId }),
  )
    .include("parcours", (related209) =>
      related209.select("startDate", "endDate"),
    )
    .first();

  if (!module?.parcours?.startDate || !module.parcours.endDate) {
    return null;
  }

  return prisma.orm.public.Module.where((row) =>
    whereFromObject(row, { id: +moduleId }),
  )
    .update({ minDate: new Date(minDate).toISOString(), maxDate: new Date(maxDate).toISOString() })
    .then(requireDatabaseRow);
}
