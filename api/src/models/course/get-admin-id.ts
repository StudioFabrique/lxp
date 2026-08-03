import { prisma } from "../../utils/db.ts";

export default async function getAdminId(userId?: string) {
  if (!userId) return null;
  const admin = await prisma.admin.findFirst({ where: { idMdb: userId } });
  return admin?.id ?? null;
}
