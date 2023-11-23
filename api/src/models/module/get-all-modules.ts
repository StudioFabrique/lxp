import { prisma } from "../../utils/db";

export default async function getAllModules() {
  const modules = await prisma.module.findMany();
  return modules ?? [];
}
