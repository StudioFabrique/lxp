import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default function putParcoursModules(
  parcoursId: number,
  moduleIds: number[],
) {
  return prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .include("modules", (related201) => related201.select("id"))
    .update({
      modules: (relation) => relation.connect(moduleIds.map((id) => ({ id }))),
    })
    .then(requireDatabaseRow);
}
