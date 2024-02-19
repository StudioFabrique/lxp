export default async function getModuleImage(moduleId: number) {
  const module = await prisma?.module.findUnique({
    where: { id: moduleId },
    select: { image: true },
  });

  return { image: module?.image.toString("base64") };
}
