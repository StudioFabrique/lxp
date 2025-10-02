import { prisma } from "../../utils/db";

async function getModulesFromParcours(parcoursId: number) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      modules: { select: { id: true, module: { select: { title: true } } } },
    },
  });

  if (!existingParcours)
    throw { statusCode: 404, message: "Parcours introuvable." };

  const modules =
    existingParcours?.modules.map((mod) => ({
      id: mod.id,
      title: mod.module.title,
    })) ?? [];

  return modules;
}

export default getModulesFromParcours;
