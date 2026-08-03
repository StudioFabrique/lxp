import { prisma } from "../../utils/db.ts";

export default async function getModuleImage(moduleId: number) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { image: true },
  });

  return {
    image:
      module && module.image
        ? Buffer.from(module.image as any).toString("base64")
        : null,
  };
}
