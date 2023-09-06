import { prisma } from "../../utils/db";

async function putModuleParcours(newModule: any, image: any) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +newModule.parcoursId },
  });

  if (!existingParcours) {
    const newError = { message: "Le parcours n'existe pas", statusCode: 404 };
    throw newError;
  }

  const updatedParcours = await prisma.parcours.update({
    where: { id: +newModule.parcoursId },
    data: {
      modules: {
        create: {
          module: {
            ...newModule,
            image,
          },
        },
      },
    },
  });

  return updatedParcours;
}

export default putModuleParcours;
