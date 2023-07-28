import { PrismaClient } from "@prisma/client";
import { File } from "buffer";
import fs from "fs";

const prisma = new PrismaClient();

async function updateImage(parcoursId: number, image: any) {
  try {
    /*   console.log("Nom du fichier :", uploadedFile.originalname);
  console.log("Type MIME :", uploadedFile.mimetype);
  console.log("Taille du fichier :", uploadedFile.size); */

    const uploadedFile = image;

    console.log(uploadedFile);

    console.log("Nom du fichier :", uploadedFile.originalname);
    console.log("Type MIME :", uploadedFile.mimetype);
    console.log("Taille du fichier :", uploadedFile.size);

    return "result";
  } catch (error) {
    throw new Error("Impossible de mettre le parcours à jour");
  }
}

export default updateImage;
