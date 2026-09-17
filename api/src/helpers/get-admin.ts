import { whereFromObject } from "../utils/prisma-query.ts";
import { noAccess } from "../utils/constantes.ts";
import { prisma } from "../utils/db.ts";

export async function getAdmin(userId: string) {
  const admin = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  )
    .select("id")
    .first();

  if (!admin) {
    throw { message: noAccess, status: 403 };
  }
  return admin;
}
