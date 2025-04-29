import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function deleteUser(userId: string, connectedId: string) {
  if (userId === connectedId)
    throw {
      message: "Vous ne pouvez pas supprimer votre propre compte utilisateur.",
      statusCode: 400,
    };

  const userToDelete = await User.findOne({ _id: userId }).populate("roles");

  if (!userToDelete)
    throw { statusCode: 404, message: "Cet utilisateur n'existe pas" };

  let prismaUser: any;

  if (userToDelete.roles.rank <= 2) {
    prismaUser = await prisma.admin.findFirst({
      where: { idMdb: userId },
    });

    if (!prismaUser)
      throw { statusCode: 404, message: "Cet utilisateur n'existe pas" };
    await prisma.admin.deleteMany({ where: { idMdb: userId } });
  } else {
    prismaUser = await prisma.student.findFirst({
      where: { idMdb: userId },
    });
    if (!prismaUser)
      throw { statusCode: 404, message: "Cet utilisateur n'existe pas" };
    await prisma.student.deleteMany({ where: { idMdb: userId } });
  }

  try {
    await User.deleteOne().where({ _id: userId });
  } catch (error) {
    if (userToDelete.roles.rank <= 2) {
      await prisma.admin.create({ data: prismaUser });
    } else {
      await prisma.student.create({ data: prismaUser });
    }

    throw {
      statusCode: 500,
      message: "Erreur lors de la suppression de l'utilisateur.",
    };
  }
}
