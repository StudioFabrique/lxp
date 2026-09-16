import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function getAdminId(userId?: string) {
  if (!userId) return null;
  const admin = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  ).first();
  return admin?.id ?? null;
}
