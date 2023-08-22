import { prisma } from "../../utils/db";

async function deleteObjective(objectiveId: string) {
  try {
    const id = parseInt(objectiveId);

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
