import { prisma } from "../../../utils/db.ts";
import type CustomRequest from "../../../utils/interfaces/express/custom-request.ts";

/**
 * Met à jour une ressource existante d'une activité
 * @param req - Requête Express personnalisée contenant les données de la ressource
 * @returns La ressource mise à jour
 */
export default async function putResource(req: CustomRequest) {
  // Extraction des données de la requête
  const { label, parent = "lesson" } = req.body;
  if (parent !== "lesson" && parent !== "resource")
    throw { statusCode: 400, message: "Parent invalide." };
  const { resourceId } = req.params;
  const userId = req.auth?.userId;

  // Recherche de la ressource existante
  const existingResource = parent === "resource"
    ? await prisma.resourceBonusActivity.findFirst({ where: { id: +resourceId }, select: { id: true } })
    : await prisma.resourceActivity.findFirst({
    where: { id: +resourceId },
    select: { id: true },
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
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };

  const updatedResource = parent === "resource"
    ? await prisma.resourceBonusActivity.update({ where: { id: +resourceId }, data: { label } })
    : await prisma.resourceActivity.update({
    where: { id: +resourceId },
    data: {
      label,
    },
  });
  return updatedResource;
}
