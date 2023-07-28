import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateImage(parcoursId: number, image: any) {
  /*  try { */
  const result = await prisma.parcours.update({
    where: {
      id: parcoursId,
    },
    data: {
      image,
    },
  });
  console.log({ result });

  return result;
  /*} catch (error) {
   console.log("oops");

    //throw new Error("La mise à jour de l'image du parcours n'a pas réussi");
  } */
}

export default updateImage;
