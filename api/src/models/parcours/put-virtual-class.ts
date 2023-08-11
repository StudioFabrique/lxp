import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function putVirtualClass(parcoursId: string, virtualClass: string) {
  const id = parseInt(parcoursId);

  const response = await prisma.parcours.update({
    where: { id },
    data: { virtualClass },
  });
  return response;
}

export default putVirtualClass;
