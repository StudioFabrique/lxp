import { and } from "@prisma/orm-postgres/orm-client";

import { prisma } from "../../db.ts";
import Group from "../../interfaces/db/group.ts";
import { type IRole } from "../../interfaces/db/role.ts";
import { type ContentType } from "../../../config/content-read.ts";

/**
 * Un parcours est lui-même une cible de contrôle d'accès, au même titre que les
 * contenus qu'il regroupe, mais il n'appartient pas au suivi de consultation.
 */
export type AccessCheckedContent = ContentType | "parcours";

export type AccessScope = {
  kind: "teacher" | "learner";
  parcoursIds: number[];
  directParcoursIds: number[] | null;
  /**
   * `null` signifie que tous les modules des parcours autorisés le sont.
   * Pour un formateur, la liste contient uniquement les modules auxquels
   * il est directement affecté.
   */
  moduleIds: number[] | null;
} | null;

function userRoleRank(userRoles: IRole[]): number {
  return userRoles[0]?.rank ?? 4;
}

/**
 * Périmètre de contenus visible par l'appelant.
 *
 * `null` signifie « aucune restriction » : c'est le cas des administrateurs.
 * Les formateurs sont bornés aux parcours auxquels ils sont directement
 * affectés comme ressources pédagogiques. Une affectation orpheline à un
 * module ou à un cours ne doit jamais rendre son parcours parent visible.
 */
export async function resolveAccessScope(auth: {
  userId: string;
  userRoles: IRole[];
}): Promise<AccessScope> {
  const rank = userRoleRank(auth.userRoles);
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
 * Le rattachement direct au parcours ouvre le parcours parent, tandis que
 * chaque module reste borné à sa propre affectation. Une affectation orpheline
 * à un module ou à un cours ne suffit jamais à rendre le parcours accessible.
 */
export async function getTeacherAccessScope(
  userIdMdb: string,
): Promise<Exclude<AccessScope, null>> {
  const contact = await prisma.orm.public.Contact.where({ idMdb: userIdMdb })
    .include("parcours", (related59) => related59.select("parcoursId"))
    .include("modules", (related60) =>
      related60
        .select("moduleId")
        .include("module", (related61) => related61.select("parcoursId")),
    )
    .first();

  if (!contact) {
    return {
      kind: "teacher",
      parcoursIds: [],
      directParcoursIds: [],
      moduleIds: [],
    };
  }

  const directParcoursIds = contact.parcours.map(
    ({ parcoursId }) => parcoursId,
  );
  const directlyAssignedModuleIds = contact.modules
    .filter(({ module }) => directParcoursIds.includes(module!.parcoursId))
    .map(({ moduleId }) => moduleId);

  return {
    kind: "teacher",
    parcoursIds: directParcoursIds,
    directParcoursIds,
    moduleIds: directlyAssignedModuleIds,
  };
}

export function isContentAllowedForScope(
  scope: Exclude<AccessScope, null>,
  type: AccessCheckedContent,
  method: string,
  coordinates: { parcoursId: number; moduleId: number | null },
) {
  const parcoursAllowed = scope.parcoursIds.includes(coordinates.parcoursId);
  const directParcoursAssignmentRequired =
    scope.kind === "teacher" && type === "parcours" && method !== "GET";
  const directlyAssignedToParcours =
    !directParcoursAssignmentRequired ||
    scope.directParcoursIds?.includes(coordinates.parcoursId);
  const moduleAllowed =
    scope.moduleIds === null ||
    coordinates.moduleId === null ||
    scope.moduleIds.includes(coordinates.moduleId);

  return parcoursAllowed && moduleAllowed && directlyAssignedToParcours;
}

export async function getAccessibleParcoursIds(
  userIdMdb: string,
): Promise<number[]> {
  const groups = await Group.find({ users: userIdMdb }).select("_id");
  if (groups.length === 0) return [];

  const groupIds = groups.map((group) => group.id as string);
  const parcoursList = await prisma.orm.public.Parcours.where((row) =>
    and(
      row.isPublished.eq(true),
      row.groups.some((groups) =>
        groups.group.some((group) => group.idMdb.in(groupIds)),
      ),
    ),
  )
    .select("id")
    .all();

  return parcoursList.map((parcours) => parcours.id);
}

/** Remonte de la chaîne activité → leçon → cours → module jusqu'au parcours. */
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
    const row = await prisma.orm.public.Parcours.where({ id: contentId })
      .select("id")
      .first();
    return row ? { parcoursId: row.id, moduleId: null } : null;
  }

  switch (type) {
    case "module": {
      const row = await prisma.orm.public.Module.where({ id: contentId })
        .select("parcoursId")
        .first();
      return row ? { parcoursId: row.parcoursId, moduleId: contentId } : null;
    }
    case "course": {
      const row = await prisma.orm.public.Course.where({ id: contentId })
        .include("module", (module) => module.select("id", "parcoursId"))
        .first();
      return row?.module
        ? { parcoursId: row.module.parcoursId, moduleId: row.module.id }
        : null;
    }
    case "lesson": {
      const row = await prisma.orm.public.Lesson.where({ id: contentId })
        .include("course", (course) =>
          course.include("module", (module) =>
            module.select("id", "parcoursId"),
          ),
        )
        .first();
      return row?.course?.module
        ? {
            parcoursId: row.course.module.parcoursId,
            moduleId: row.course.module.id,
          }
        : null;
    }
    case "activity": {
      const row = await prisma.orm.public.Activity.where({ id: contentId })
        .include("lesson", (lesson) =>
          lesson.include("course", (course) =>
            course.include("module", (module) =>
              module.select("id", "parcoursId"),
            ),
          ),
        )
        .first();
      return row?.lesson?.course?.module
        ? {
            parcoursId: row.lesson.course.module.parcoursId,
            moduleId: row.lesson.course.module.id,
          }
        : null;
    }
  }
}
