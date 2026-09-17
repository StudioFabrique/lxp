import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function deleteObjective(objectiveId: string) {
  const id = parseInt(objectiveId);

  const exisitingObjective = await prisma.orm.public.Objective.where({
    id,
  }).first();

  if (!exisitingObjective) {
    const error = new Error("L'objectif n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    const result = await prisma.orm.public.Objective.where({ id })
      .select("id")
      .delete()
      .then(requireDatabaseRow);
    return result;
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error;
    } else {
      const newError = new Error(
        "L'objectif n'a pas pu être effacé car il est rattaché à un cours",
      );
      (error as any).statusCode = 500;
      throw newError;
    }
  }
}

export default deleteObjective;
