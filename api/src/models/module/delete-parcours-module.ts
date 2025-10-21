import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function deleteParcoursModule(
  moduleId: number,
  userId: string
) {
  const existingModule = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { admin: true },
  });

  if (!existingModule) throw { status: 404, message: "Module not found" };

  const userRole = await User.findOne({ _id: userId }).populate("role", {
    rank: 1,
  });

  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingUser) throw { status: 404, message: "User not found" };

  if (
    userRole!.roles[0].rank === 1 ||
    existingUser.id === existingModule.admin.id
  ) {
    await prisma.moduleMetadata.delete({
      where: { id: moduleId },
    });
  }
}
