import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getFormation() {
  const formations = await prisma.formation.findMany();

  if (!formations || formations.length === 0) {
    return false;
  }

  return formations;
}

export default getFormation;
