import { prisma } from "../../utils/db";

async function putParcoursObjectives(
  parcoursId: string,
  objectives: Array<any>
) {
  const id = parseInt(parcoursId);

  try {
    const existingParcours = await prisma.parcours.findUnique({
      where: { id },
    });

    if (!existingParcours) {
      const parcoursError: any = new Error("Parcours inexistant");
      parcoursError.status = 404;
      throw parcoursError;
    }

    const updatedParcours = await prisma.parcours.update({
      where: { id },
      data: {
        objectives: {
          create: objectives.map((objective: any) => {
            return {
              description: objective,
            };
          }),
        },
      },
    });

    const offset =
      (await prisma.objective.count({ where: { parcoursId: id } })) -
      objectives.length;
    const limit = objectives.length;

    console.log({ offset, limit });

    const result = await prisma.objective.findMany({
      where: { parcoursId: id },
      skip: offset,
      take: limit,
      select: { id: true, description: true },
    });

    return result;
  } catch (error) {
    throw error; // Rethrow any errors that occur during the process
  }
}

export default putParcoursObjectives;
