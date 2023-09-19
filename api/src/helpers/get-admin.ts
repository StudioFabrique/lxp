import { noAccess } from "../utils/constantes";
import { prisma } from "../utils/db";

export async function getAdmin(userId: string) {
  const admin = await prisma.admin.findFirst({
    where: { idMdb: userId },
    select: { id: true },
  });

  if (!admin) {
    throw { message: noAccess, status: 403 };
  }
  return admin;
}
