import {
  requireDatabaseRow,
  whereFromObject,
} from "../../utils/prisma-query.ts";
import type { Objective } from "../../prisma/model-types.ts";
import { prisma } from "../../utils/db.ts";

async function putObjective(objective: Objective) {
  try {
    const exisitingObjective = await prisma.orm.public.Objective.where((row) =>
      whereFromObject(row, { id: +objective.id }),
    ).first();

    if (!objective) {
      const objError: any = {
        message: "L'objectif de parcours n'existe pas",
        status: 404,
      };
      throw objError;
    }

    const updatedObjective = await prisma.orm.public.Objective.where((row) =>
      whereFromObject(row, { id: +objective.id }),
    )
      .select("id", "description")
      .update({ description: objective.description })
      .then(requireDatabaseRow);
    return updatedObjective;
  } catch (error: any) {
    throw error;
  }
}

export default putObjective;
