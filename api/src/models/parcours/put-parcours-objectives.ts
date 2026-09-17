import { requireDatabaseRow } from "../../utils/require-database-row.ts";
import { prisma } from "../../utils/db.ts";

async function putParcoursObjectives(
  parcoursId: string,
  objectives: Array<any>,
) {
  const id = parseInt(parcoursId);

  try {
    const existingParcours = await prisma.orm.public.Parcours.where({
      id,
    }).first();

    if (!existingParcours) {
      const parcoursError: any = new Error("Parcours inexistant");
      parcoursError.status = 404;
      throw parcoursError;
    }

    const updatedParcours = await prisma.orm.public.Parcours.where({ id })
      .update({
        objectives: (relation) =>
          relation.create(
            objectives.map((objective: any) => {
              return {
                description: objective,
              };
            }),
          ),
      })
      .then(requireDatabaseRow);

    const offset =
      (await prisma.orm.public.Objective.where({ parcoursId: id })
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total)) - objectives.length;
    const limit = objectives.length;

    const result = await prisma.orm.public.Objective.where({ parcoursId: id })
      .select("id", "description")
      .offset(offset)
      .limit(limit)
      .all();

    return result;
  } catch (error) {
    throw error; // Rethrow any errors that occur during the process
  }
}

export default putParcoursObjectives;
