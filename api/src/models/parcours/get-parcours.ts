import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcours() {
  const response = await prisma.parcours.findFirst();

  if (!response) {
    throw new Error(`Data not found.`);
  }
  return response;
}

export default getParcours;
