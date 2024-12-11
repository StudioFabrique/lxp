import { prisma } from "../../../utils/db";
import CustomRequest from "../../../utils/interfaces/express/custom-request";
import path from "path";
import fs from "fs";

/**
 * Met à jour une ressource existante d'une activité
 * @param req - Requête Express personnalisée contenant les données de la ressource
 * @returns La ressource mise à jour
 */
export default async function putResource(req: CustomRequest) {
  // Extraction des données de la requête
  const { label } = req.body;
  const { resourceId } = req.params;
  const userId = req.auth?.userId;

  // Recherche de la ressource existante
  const existingResource = await prisma.resourceActivity.findFirst({
    where: { id: +resourceId },
    select: { id: true, activity: true, url: true },
  });

  // Vérification de l'existence de la ressource
  if (!existingResource)
    throw { statusCode: 404, message: "La ressource n'existe pas." };

  // Recherche de l'utilisateur
  const existingUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  // Vérification de l'existence de l'utilisateur
  if (!existingUser)
    throw { statusCodes: 404, message: "L'utilisateur n'existe pas." };

  // Vérification des droits d'accès
  if (existingUser.id !== existingResource.activity.authorId)
    throw {
      statusCode: 406,
      message: "Vous n'êtes pas le propriétaire de cette ressource.",
    };
  const updatedResource = await prisma.resourceActivity.update({
    where: { id: +resourceId },
    data: {
      label,
    },
  });
  return updatedResource;
}
