import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

async function postModule(
  moduleToAdd: any,
  thumb: any,
  image: any,
  userId: string
) {
  const existingParcours = await prisma.formation.findFirst({
    where: { id: moduleToAdd.formationId },
  });

  if (!existingParcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

  const existingUser = await User.findById(userId, {
    firstname: 1,
    lastname: 1,
  });

  if (!existingUser) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    const error: any = {
      message: "L'admin n'existe pas.",
      statusCode: 400,
    };
    throw error;
  }

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
