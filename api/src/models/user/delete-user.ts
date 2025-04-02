import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function deleteUser(userId: string, connectedId: string) {
  console.log({ userId, connectedId });

  if (userId === connectedId)
    throw new Error("Vous ne pouvez pas vous supprimer vous même");

  try {
    await prisma.student.deleteMany({ where: { idMdb: userId } });
    await prisma.admin.deleteMany({ where: { idMdb: userId } });
    await User.deleteOne().where({ _id: userId });
  } catch (error) {
    throw new Error("Cet utilisateur ne peut pas être supprimé");
  }
}
