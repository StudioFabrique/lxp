import { prisma } from "../../utils/db";

async function deleteObjective(objectiveId: string) {
  try {
    const id = parseInt(objectiveId);

    const exisitingObjective = await prisma.objective.findFirst({
      where: { id },
    });

    if (!exisitingObjective) {
      const objectiveError: any = new Error("L'objectif n'existe pas");
      objectiveError.status = 404;
      throw objectiveError;
    }

    const result = await prisma.objective.delete({
      where: { id },
      select: { id: true },
    });

    return result;
  } catch (error: any) {
    throw error;
  }
}

export default deleteObjective;
