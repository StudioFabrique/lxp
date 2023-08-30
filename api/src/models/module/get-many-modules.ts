export default async function getManyModules(parcoursId: number) {
  const modules = await prisma?.module.findMany({
    where: { parcoursId: parcoursId },
  });

  if (modules) {
    return modules;
  }

  return null;
}
