import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateImage(parcoursId: number, image: Buffer) {
  try {
    // conversion de l'image en donnée enregistrable sous forme de Blob dans la bdd
    //const imageBuffer = Buffer.from(image.split(",")[1], "base64");

    const result = await prisma.parcours.update({
      where: { id: parcoursId },
      data: { image: image },
    });
    return result;
  } catch (error) {
    throw new Error("Impossible de mettre le parcours à jour");
  }
}

export default updateImage;
