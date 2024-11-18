import { prisma } from "../../utils/db";

/**
 * Récupère une liste simplifiée des parcours avec uniquement leur id et titre
 * Utilisé pour les menus déroulants et les sélecteurs de parcours
 * @returns Liste des parcours avec {id, title}
 */
export default async function getSelectParcours() {
  // Requête Prisma pour obtenir tous les parcours avec une sélection minimale
  const parcoursList = await prisma.parcours.findMany({
    select: { id: true, title: true },
  });

  return parcoursList;
}
