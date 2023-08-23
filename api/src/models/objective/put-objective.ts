import { Objective } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putObjective(objective: Objective) {
  try {
    const exisitingObjective = await prisma.objective.findFirst({
      where: { id: objective.id },
    });

    if (!objective) {
      const objError: any = {
        message: "L'objectif de parcours n'existe pas",
        status: 404,
      };
      throw objError;
    }

    const updatedObjective = await prisma.objective.update({
      where: { id: objective.id },
      data: { description: objective.description },
      select: { id: true, description: true },
    });
    return updatedObjective;
  } catch (error: any) {
    throw error;
  }
}

export default putObjective;
