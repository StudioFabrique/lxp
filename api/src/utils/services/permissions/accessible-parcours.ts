import { prisma } from "../../db.ts";
import Group from "../../interfaces/db/group.ts";
import { type IRole } from "../../interfaces/db/role.ts";
import { type ContentType } from "../../../config/content-read.ts";

/**
 * Un parcours est lui-même une cible de contrôle d'accès, au même titre que les
 * contenus qu'il regroupe, mais il n'appartient pas au suivi de consultation.
 */
export type AccessCheckedContent = ContentType | "parcours";

/**
 * Rang à partir duquel un utilisateur ne voit que les contenus des parcours
 * auxquels il est inscrit. Les rangs 1 (administrateur) et 2 (formateur)
 * encadrent l'ensemble du catalogue, convention déjà appliquée par
 * `models/group/search-group.ts`.
 */
const FIRST_ENROLLED_RANK = 3;

export function isRestrictedToEnrollment(userRoles: IRole[]): boolean {
  return userRoles.every((role) => role.rank >= FIRST_ENROLLED_RANK);
}

/**
 * Identifiants des parcours auxquels un apprenant est rattaché.
 *
 * L'inscription n'est pas stockée d'un seul côté : l'appartenance à un groupe
 * vit dans Mongo, le rattachement du groupe au parcours dans PostgreSQL. La
 * jointure se fait donc ici, par l'identifiant Mongo du groupe.
 */
/**
 * Périmètre de contenus visible par l'appelant.
 *
 * `null` signifie « aucune restriction » : c'est le cas des administrateurs et
 * des formateurs, qui encadrent le catalogue entier. Toute autre valeur est la
 * liste, éventuellement vide, des parcours auxquels l'apprenant est inscrit.
 */
export async function resolveAccessScope(auth: {
  userId: string;
  userRoles: IRole[];
}): Promise<number[] | null> {
  if (!isRestrictedToEnrollment(auth.userRoles)) return null;
  return getAccessibleParcoursIds(auth.userId);
}

export async function getAccessibleParcoursIds(
  userIdMdb: string,
): Promise<number[]> {
  const groups = await Group.find({ users: userIdMdb }).select("_id");
  if (groups.length === 0) return [];

  const groupIds = groups.map((group) => group.id as string);
  const parcoursList = await prisma.parcours.findMany({
    where: {
      isPublished: true,
      groups: { some: { group: { idMdb: { in: groupIds } } } },
    },
    select: { id: true },
  });

  return parcoursList.map((parcours) => parcours.id);
}

/** Remonte de la chaîne activité → leçon → cours → module jusqu'au parcours. */
const PARCOURS_SELECTION = {
  module: { parcoursId: true },
  course: { module: { select: { parcoursId: true } } },
  lesson: { course: { select: { module: { select: { parcoursId: true } } } } },
  activity: {
    lesson: {
      select: { course: { select: { module: { select: { parcoursId: true } } } } },
    },
  },
} as const;

/**
 * Parcours dont relève un contenu, ou `null` si le contenu n'existe pas.
 *
 * Une seule requête quel que soit le niveau : la profondeur est portée par la
 * sélection imbriquée plutôt que par une cascade de lectures.
 */
export async function findParcoursIdForContent(
  type: AccessCheckedContent,
  contentId: number,
): Promise<number | null> {
  if (type === "parcours") {
    const row = await prisma.parcours.findUnique({
      where: { id: contentId },
      select: { id: true },
    });
    return row?.id ?? null;
  }

  const query = { where: { id: contentId }, select: PARCOURS_SELECTION[type] };

  switch (type) {
    case "module": {
      const row = await prisma.module.findUnique(query as any);
      return row?.parcoursId ?? null;
    }
    case "course": {
      const row: any = await prisma.course.findUnique(query as any);
      return row?.module?.parcoursId ?? null;
    }
    case "lesson": {
      const row: any = await prisma.lesson.findUnique(query as any);
      return row?.course?.module?.parcoursId ?? null;
    }
    case "activity": {
      const row: any = await prisma.activity.findUnique(query as any);
      return row?.lesson?.course?.module?.parcoursId ?? null;
    }
  }
}
