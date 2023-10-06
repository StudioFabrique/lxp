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

  const result = await prisma.objective.delete({
    where: { id },
    select: { id: true },
  });

  return result;
}

export default deleteObjective;
