import { prisma } from "../../utils/db";
import { IRole } from "../../utils/interfaces/db/role";

export default async function deleteResource(
  resourceId: number,
  userId: string,
  userRoles: IRole[],
) {
  const existingResource = await prisma.resource.findFirst({
    where: { id: resourceId },
  });

  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  if (
    existingResource.adminId === existingUser.id ||
    userRoles.some((role) => role.rank < 2)
  ) {
    await prisma.resource.delete({
      where: { id: resourceId },
    });
  } else
    throw {
      statusCode: 405,
      message: "Vous n'avez pas la permission de supprimer cette ressource.",
    };
  return;
}
