import { prisma } from "../../db.ts";
import Group from "../../interfaces/db/group.ts";
import { type IRole } from "../../interfaces/db/role.ts";
import { type ContentType } from "../../../config/content-read.ts";

/**
 * Un parcours est lui-même une cible de contrôle d'accès, au même titre que les
 * contenus qu'il regroupe, mais il n'appartient pas au suivi de consultation.
 */
export type AccessCheckedContent = ContentType | "parcours";

export type AccessScope =
  | {
      kind: "teacher" | "learner";
      parcoursIds: number[];
      directParcoursIds: number[] | null;
      /**
       * `null` signifie que tous les modules des parcours autorisés le sont.
       * Pour un formateur, la liste contient les modules auxquels il est
       * affecté directement ainsi que ceux des parcours auxquels il est affecté.
       */
      moduleIds: number[] | null;
    }
  | null;

function highestPrivilegeRank(userRoles: IRole[]): number {
  return Math.min(...userRoles.map((role) => role.rank), 4);
}

/**
 * Périmètre de contenus visible par l'appelant.
 *
 * `null` signifie « aucune restriction » : c'est le cas des administrateurs.
 * Les formateurs sont bornés aux parcours et modules auxquels ils sont
 * affectés comme ressources pédagogiques. L'affectation d'un cours n'entre
 * volontairement pas dans ce calcul.
 */
export async function resolveAccessScope(auth: {
  userId: string;
  userRoles: IRole[];
}): Promise<AccessScope> {
  const rank = highestPrivilegeRank(auth.userRoles);
  if (rank <= 1) return null;

  if (rank === 2) return getTeacherAccessScope(auth.userId);

  return {
    kind: "learner",
    parcoursIds: await getAccessibleParcoursIds(auth.userId),
    directParcoursIds: null,
    moduleIds: null,
  };
}

/**
 * Périmètre d'un formateur.
 *
 * Une affectation au parcours donne accès à tous ses modules. Une affectation
 * au module donne accès à ce module et fait apparaître son parcours et sa
 * formation parents. Les contacts posés directement sur un cours ne confèrent
 * aucun accès supplémentaire.
 */
export async function getTeacherAccessScope(
  userIdMdb: string,
): Promise<Exclude<AccessScope, null>> {
  const contact = await prisma.contact.findUnique({
    where: { idMdb: userIdMdb },
    select: {
      parcours: { select: { parcoursId: true } },
      modules: {
        select: {
          moduleId: true,
          module: { select: { parcoursId: true } },
        },
      },
    },
  });

  if (!contact) {
    return {
      kind: "teacher",
      parcoursIds: [],
      directParcoursIds: [],
      moduleIds: [],
    };
  }

  const directParcoursIds = contact.parcours.map(({ parcoursId }) => parcoursId);
  const directModuleIds = contact.modules.map(({ moduleId }) => moduleId);
  const moduleParcoursIds = contact.modules.map(
    ({ module }) => module.parcoursId,
  );
  const inheritedModules =
    directParcoursIds.length === 0
      ? []
      : await prisma.module.findMany({
          where: { parcoursId: { in: directParcoursIds } },
          select: { id: true },
        });

  return {
    kind: "teacher",
    parcoursIds: [...new Set([...directParcoursIds, ...moduleParcoursIds])],
    directParcoursIds,
    moduleIds: [
      ...new Set([
        ...directModuleIds,
        ...inheritedModules.map(({ id }) => id),
      ]),
    ],
  };
}

export function parcoursWhereForScope(scope: AccessScope) {
  return scope === null ? undefined : { id: { in: scope.parcoursIds } };
}

export function moduleWhereForScope(scope: AccessScope) {
  if (scope === null) return undefined;
  return scope.moduleIds === null
    ? { parcoursId: { in: scope.parcoursIds } }
    : { id: { in: scope.moduleIds } };
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
  course: { module: { select: { id: true, parcoursId: true } } },
  lesson: {
    course: { select: { module: { select: { id: true, parcoursId: true } } } },
  },
  activity: {
    lesson: {
      select: {
        course: {
          select: { module: { select: { id: true, parcoursId: true } } },
        },
      },
    },
  },
} as const;

/**
 * Parcours dont relève un contenu, ou `null` si le contenu n'existe pas.
 *
 * Une seule requête quel que soit le niveau : la profondeur est portée par la
 * sélection imbriquée plutôt que par une cascade de lectures.
 */
export async function findContentAccessCoordinates(
  type: AccessCheckedContent,
  contentId: number,
): Promise<{ parcoursId: number; moduleId: number | null } | null> {
  if (type === "parcours") {
    const row = await prisma.parcours.findUnique({
      where: { id: contentId },
      select: { id: true },
    });
    return row ? { parcoursId: row.id, moduleId: null } : null;
  }

  const query = { where: { id: contentId }, select: PARCOURS_SELECTION[type] };

  switch (type) {
    case "module": {
      const row = await prisma.module.findUnique(query as any);
      return row
        ? { parcoursId: row.parcoursId, moduleId: contentId }
        : null;
    }
    case "course": {
      const row: any = await prisma.course.findUnique(query as any);
      return row?.module
        ? { parcoursId: row.module.parcoursId, moduleId: row.module.id }
        : null;
    }
    case "lesson": {
      const row: any = await prisma.lesson.findUnique(query as any);
      return row?.course?.module
        ? {
            parcoursId: row.course.module.parcoursId,
            moduleId: row.course.module.id,
          }
        : null;
    }
    case "activity": {
      const row: any = await prisma.activity.findUnique(query as any);
      return row?.lesson?.course?.module
        ? {
            parcoursId: row.lesson.course.module.parcoursId,
            moduleId: row.lesson.course.module.id,
          }
        : null;
    }
  }
}
