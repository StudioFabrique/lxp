import { prisma } from "../../utils/db.ts";

export default async function getAdminId(userId?: string) {
  if (!userId) return null;
  const admin = await prisma.orm.public.Admin.where({ idMdb: userId }).first();
  return admin?.id ?? null;
}
