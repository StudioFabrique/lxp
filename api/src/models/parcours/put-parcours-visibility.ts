import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default async function putParcoursVisibility(id: number, visibility: boolean) {
  const parcours = await prisma.orm.public.Parcours.where({ id }).first();
  if (!parcours) throw { statusCode: 404, message: "Le parcours n'existe pas." };
  return prisma.orm.public.Parcours.where({ id })
    .update({ visibility })
    .then(requireDatabaseRow);
}
