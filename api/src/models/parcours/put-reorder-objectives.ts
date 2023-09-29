import { Objective } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putReorderObjectives(
  parcoursId: string,
  objectivesId: Array<number>
) {
  const id = parseInt(parcoursId);

  return prisma.$transaction(async (prismaClient) => {
    const existingParcours = await prismaClient.parcours.findUnique({
      where: { id },
    });

    if (!existingParcours) {
      const parcoursError: any = {
        message: "Le parcours n'existe pas",
        status: 404,
      };
      throw parcoursError;
    }

    const objectives = await prismaClient.objective.findMany({
      where: {
        id: {
          in: objectivesId,
        },
      },
    });

    console.log({ objectives });

    let tmp = Array<Objective>();
    for (const index of objectivesId) {
      let obj = objectives.find((item) => item.id === index);
      if (obj) {
        tmp.push(obj);
      }
    }

    console.log({ tmp });

    await prismaClient.objective.deleteMany({ where: { parcoursId: id } });

    const updatedParcours = await prismaClient.parcours.update({
      where: { id },
      data: {
        objectives: {
          create: tmp.map((objective: any) => {
            return {
              description: objective.description,
            };
          }),
        },
      },
      select: { objectives: { select: { id: true, description: true } } },
    });
    return updatedParcours;
  });
}

export default putReorderObjectives;
