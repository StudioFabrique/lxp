import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFormation() {
  const formations = await prisma.formation.findMany();

  return formations.map((item: any) => ({ id: item.id, title: item.title }));
}

export default getFormation;
