// Import du client Prisma pour interagir avec la base de données
import { prisma } from "../../utils/db";
// Import de l'utilitaire de pagination
import { getPagination } from "../../utils/services/getPagination";

export type GetMediasParams = {
  page?: string;
  limit?: string;
  type?: string;
  sort?: string;
};

/**
 * Récupère toutes les images stockées dans la médiathèque de façon paginée
 * @param req - La requête Express contenant les paramètres de pagination
 * @returns Une promesse contenant un tableau des médias de type "image"
 */
export default async function getMedias(params: GetMediasParams) {
  let { page, limit, type, sort } = params;
  const types = ["image", "resource", "video", "audio"];
  const sorts = ["createdAt", "size", "used", "name"];

  // Valeurs par défaut si les paramètres ne sont pas fournis
  if (!page) {
    page = "1"; // Page 1 par défaut
  }
  if (!limit) {
    limit = "10"; // 10 éléments par page par défaut
  }
  if (!types.includes(type as string)) {
    type = "image"; // Type par défaut
  }
  if (!sorts.includes(sort as string)) {
    sort = "createdAt"; // Tri par défaut
  }

  // Retourne le nombre total de médias de type "image"
  const totalMedias = await prisma.mediatheque.count({
    where: {
      type: type as "image" | "resource" | "video" | "audio", // Filtre uniquement les médias de type image
    },
  });

  const totalPages = Math.ceil(totalMedias / +limit!);

  // Calcul de l'offset pour la pagination
  const offset = getPagination(+page!, +limit!);

  // Recherche dans la table mediatheque tous les éléments de type "image"
  // avec pagination et tri par date de création décroissante
  const medias = await prisma.mediatheque.findMany({
    where: {
      type: type as "image" | "video" | "audio" | "resource", // Filtre uniquement les médias de type image
    },
    skip: offset, // Nombre d'éléments à sauter (pagination)
    take: +limit!, // Nombre d'éléments à retourner
    orderBy: {
      [sort as string]: "desc", // Tri par date de création décroissante
    },
  });

  return { medias, totalPages: totalPages === 0 ? 1 : totalPages };
}
