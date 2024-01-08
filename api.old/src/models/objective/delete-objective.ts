import { prisma } from "../../utils/db";

async function deleteObjective(objectiveId: string) {
  const id = parseInt(objectiveId);

  const exisitingObjective = await prisma.objective.findFirst({
    where: { id },
  });

  if (!exisitingObjective) {
    const error = new Error("L'objectif n'existe pas");
    (error as any).statusCode = 404;
    throw error;
  }

  try {
    const result = await prisma.objective.delete({
      where: { id },
      select: { id: true },
    });
    return result;
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error;
    } else {
      const newError = new Error(
        "L'objectif n'a pas pu être effacé car il est rattaché à un cours"
      );
      (error as any).statusCode = 500;
      throw newError;
    }
  }
}

export default deleteObjective;
