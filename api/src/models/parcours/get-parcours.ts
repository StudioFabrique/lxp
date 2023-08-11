import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcours() {
  const response = await prisma.parcours.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      formation: { select: { title: true, level: true } },
    },
  });

  if (!response) {
    throw new Error(`Data not found.`);
  }
  return response;
}

export default getParcours;
