import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

export default function putParcoursModules(
  parcoursId: number,
  moduleIds: number[],
) {
  return prisma.orm.public.Parcours.where({ id: parcoursId })
    .include("modules", (related201) => related201.select("id"))
    .update({
      modules: (relation) => relation.connect(moduleIds.map((id) => ({ id }))),
    })
    .then(requireDatabaseRow);
}
