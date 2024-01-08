import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function postModule(data: any, thumb: any, image: any, userId: string) {
  const moduleToAdd = JSON.parse(data);
  const existingParcours = await prisma.formation.findFirst({
    where: { id: moduleToAdd.formationId },
  });

  checkRessource(existingParcours !== null);

  const existingUser = await User.findById(userId, {
    firstname: 1,
    lastname: 1,
  });

  checkRessource(existingUser !== null);

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  checkRessource(existingAdmin !== null);

  const author = `${existingUser?.firstname} ${existingUser?.lastname}`;

  let newModule: any = {};

  const transaction = await prisma.$transaction(async (tx) => {
    newModule = await tx.module.create({
      data: {
        title: moduleToAdd.title,
        description: moduleToAdd.description,
        duration: +moduleToAdd.duration,
        image,
        thumb,
        author,
        adminId: existingAdmin!.id,
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

function checkRessource(value: boolean) {
  if (!value) {
    const error = { message: "Ressource inexistante", statusCode: 404 };
    throw error;
  }
}
