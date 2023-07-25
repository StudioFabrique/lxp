import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getParcours() {
  const response = await prisma.parcours.findFirst();

  if (!response) {
    throw new Error(`Data not found.`);
  }

  const base64Image = response!.image.toString("base64");
  return base64Image;
}

export default getParcours;
