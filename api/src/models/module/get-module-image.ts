import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

export default async function getModuleImage(moduleId: number) {
  const module = await prisma.orm.public.Module.where((row) =>
    whereFromObject(row, { id: moduleId }),
  )
    .select("image")
    .first();

  return {
    image:
      module && module.image
        ? Buffer.from(module.image as any).toString("base64")
        : null,
  };
}
