import { prisma } from "../../utils/db";

async function postModule(data: any, thumb: any, image: any) {
  const moduleToAdd = JSON.parse(data);
  const existingParcours = await prisma.formation.findFirst({
    where: { id: moduleToAdd.formationId },
  });

  if (!existingParcours) {
    const error = { message: "Ressource inexistante", statusCode: 404 };
    throw error;
  }

  let newModule: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    newModule = await tx.module.create({
      data: {
        title: moduleToAdd.title,
        description: moduleToAdd.description,
        duration: +moduleToAdd.duration,
        image,
        thumb,
      },
      select: { id: true, title: true, description: true, thumb: true },
    });
    const updatedFormation = await tx.formation.update({
      where: { id: moduleToAdd.formationId },
      data: {
        modules: {
          create: {
            module: {
              connect: { id: newModule.id },
            },
          },
        },
      },
    });
  });

  const result = { ...newModule, thumb: newModule.thumb.toString("base64") };

  return result;
}

export default postModule;
