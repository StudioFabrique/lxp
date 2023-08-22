import { Objective } from "@prisma/client";
import { prisma } from "../../utils/db";

async function putReorderObjectives(
  parcoursId: string,
  objectivesId: Array<number>
) {
  const id = parseInt(parcoursId);
  const existingParcours = await prisma.parcours.findUnique({
    where: { id },
  });

  if (!existingParcours) {
    const parcoursError: any = {
      message: "Le parcours n'existe pas",
      status: 404,
    };
    throw parcoursError;
  }

  const objectives = await prisma.objective.findMany({
    where: {
      id: {
        in: objectivesId,
      },
    },
  });

  let tmp = Array<Objective>();
  for (const index of objectivesId) {
    let obj = objectives.find((item) => item.id === index);
    if (obj) {
      tmp.push(obj);
    }
  }

  await prisma.objective.deleteMany({ where: { parcoursId: id } });

  const updatedParcours = await prisma.parcours.update({
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
  });

  return updatedParcours;
}

export default putReorderObjectives;
