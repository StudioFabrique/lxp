import { prisma } from "../../utils/db";
export default async function deleteResource(
  resourceId: number,
  userId: string,
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

  await prisma.resource.delete({
    where: { id: resourceId },
  });
  return;
}
