import fs from "node:fs/promises";

import {
  extractLocalImagesFromHtml,
  resolveActivityFilePath,
} from "../../helpers/activity-file-cleanup.ts";
import { prisma } from "../../utils/db.ts";
import { getPagination } from "../../utils/services/getPagination.ts";

export type GetMediasParams = {
  page?: string;
  limit?: string;
  type?: string;
  sort?: string;
  search?: string;
};

type AssociatedActivity = {
  id: number;
  title: string;
  type: string;
  order: number;
  parent: "lesson" | "resource";
  parentTitle: string;
  courseTitle?: string;
  moduleTitle?: string;
  moduleId?: number;
  lessonId?: number;
  resourceId?: number;
};

// Les fichiers de texte sont immuables : une modification crée un nouveau
// fichier. Ce cache évite donc de relire tous les contenus à chaque page.
const inlineImageReferencesCache = new Map<string, string[]>();

/**
 * Récupère toutes les images stockées dans la médiathèque de façon paginée
 * @param req - La requête Express contenant les paramètres de pagination
 * @returns Une promesse contenant un tableau des médias de type "image"
 */
export default async function getMedias(params: GetMediasParams) {
  let { page, limit, type, sort } = params;
  const search = params.search?.trim();
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
  const where = {
    type: type as "image" | "resource" | "video" | "audio",
    ...(search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {}),
  };
  const totalMedias = await prisma.mediatheque.count({ where });

  const totalPages = Math.ceil(totalMedias / +limit!);

  // Calcul de l'offset pour la pagination
  const offset = getPagination(+page!, +limit!);

  // Recherche dans la table mediatheque tous les éléments de type "image"
  // avec pagination et tri par date de création décroissante
  const medias = await prisma.mediatheque.findMany({
    where,
    skip: offset, // Nombre d'éléments à sauter (pagination)
    take: +limit!, // Nombre d'éléments à retourner
    orderBy: {
      [sort as string]: "desc", // Tri par date de création décroissante
    },
  });

  const urls = medias.map((media) => media.url);
  if (urls.length === 0) {
    return {
      medias: [],
      total: totalMedias,
      totalPages: totalPages === 0 ? 1 : totalPages,
    };
  }

  const [lessonActivities, bonusActivities] = await Promise.all([
    prisma.activity.findMany({
      where: {
        OR: [
          { url: { in: urls } },
          { resourceActivities: { some: { url: { in: urls } } } },
          ...(type === "image" ? [{ type: "text" as const }] : []),
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        order: true,
        url: true,
        resourceActivities: {
          where: { url: { in: urls } },
          select: { url: true },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                title: true,
                module: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
    }),
    prisma.bonusActivity.findMany({
      where: {
        OR: [
          { url: { in: urls } },
          { resourceBonusActivities: { some: { url: { in: urls } } } },
          ...(type === "image" ? [{ type: "text" as const }] : []),
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        order: true,
        url: true,
        resourceBonusActivities: {
          where: { url: { in: urls } },
          select: { url: true },
        },
        resource: { select: { id: true, title: true } },
      },
    }),
  ]);

  const associations = new Map<string, AssociatedActivity[]>();
  const addAssociation = (url: string, activity: AssociatedActivity) => {
    if (!url || !urls.includes(url)) return;

    const current = associations.get(url) ?? [];
    if (
      !current.some(
        (item) => item.id === activity.id && item.parent === activity.parent,
      )
    ) {
      current.push(activity);
      associations.set(url, current);
    }
  };

  const addInlineImageAssociations = async (
    activityUrl: string,
    association: AssociatedActivity,
  ) => {
    if (association.type !== "text") return;

    const filePath = resolveActivityFilePath({
      url: activityUrl,
      type: "text",
      trackedInMediatheque: false,
    });
    if (!filePath) return;

    try {
      let referencedUrls = inlineImageReferencesCache.get(activityUrl);
      if (!referencedUrls) {
        const html = await fs.readFile(filePath, "utf8");
        referencedUrls = extractLocalImagesFromHtml(html).map(
          (reference) => reference.url,
        );
        inlineImageReferencesCache.set(activityUrl, referencedUrls);
      }
      for (const referencedUrl of referencedUrls) {
        addAssociation(referencedUrl, association);
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  };

  await Promise.all(
    lessonActivities.map(async (activity) => {
      const association: AssociatedActivity = {
        id: activity.id,
        title: activity.title?.trim() || "Activité sans titre",
        type: activity.type,
        order: activity.order,
        parent: "lesson",
        parentTitle: activity.lesson.title,
        courseTitle: activity.lesson.course.title,
        moduleTitle: activity.lesson.course.module.title,
        moduleId: activity.lesson.course.module.id,
        lessonId: activity.lesson.id,
      };
      addAssociation(activity.url, association);
      for (const resource of activity.resourceActivities) {
        addAssociation(resource.url, association);
      }
      await addInlineImageAssociations(activity.url, association);
    }),
  );

  await Promise.all(
    bonusActivities.map(async (activity) => {
      const association: AssociatedActivity = {
        id: activity.id,
        title: activity.title?.trim() || "Activité sans titre",
        type: activity.type,
        order: activity.order,
        parent: "resource",
        parentTitle: activity.resource.title,
        resourceId: activity.resource.id,
      };
      addAssociation(activity.url, association);
      for (const resource of activity.resourceBonusActivities) {
        addAssociation(resource.url, association);
      }
      await addInlineImageAssociations(activity.url, association);
    }),
  );

  return {
    medias: medias.map((media) => ({
      ...media,
      associatedActivities: associations.get(media.url) ?? [],
    })),
    total: totalMedias,
    totalPages: totalPages === 0 ? 1 : totalPages,
  };
}
