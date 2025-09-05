import { prisma } from "../../utils/db";

export default async function getResourcesList() {
  return await prisma.resource.findMany();
}
