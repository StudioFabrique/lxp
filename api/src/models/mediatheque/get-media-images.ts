// Import du client Prisma pour interagir avec la base de données
import { prisma } from "../../utils/db";

/**
 * Récupère toutes les images stockées dans la médiathèque
 * @returns Une promesse contenant un tableau des médias de type "image"
 */
export default async function getMediaImages() {
  // Recherche dans la table mediatheque tous les éléments de type "image"
  const medias = await prisma.mediatheque.findMany({
    where: {
      type: "image",
    },
  });
  return medias;
}
