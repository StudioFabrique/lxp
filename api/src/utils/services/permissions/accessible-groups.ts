import type { FilterQuery } from "mongoose";
import { prisma } from "../../db.ts";
import Group, { type IGroup } from "../../interfaces/db/group.ts";
import type CustomRequest from "../../interfaces/express/custom-request.ts";
import { resolveAccessScope } from "./accessible-parcours.ts";

type GroupAccessAuth = NonNullable<CustomRequest["auth"]>;

type GroupParcoursLinks = {
  idMdb: string;
  parcours: Array<{ parcoursId: number }>;
};

function attachedGroupIds(groupsWithParcours: GroupParcoursLinks[]) {
  return groupsWithParcours
    .filter(({ parcours }) => parcours.length > 0)
    .map(({ idMdb }) => idMdb);
}

export function buildAttachedGroupVisibilityFilter(
  groupsWithParcours: GroupParcoursLinks[],
): FilterQuery<IGroup> {
  return { _id: { $in: attachedGroupIds(groupsWithParcours) } };
}

/**
 * Traduit les rattachements PostgreSQL en filtre MongoDB pour un formateur.
 *
 * Un groupe rattaché est visible dès qu'au moins un de ses parcours est dans
 * le périmètre du formateur. Un groupe sans aucun rattachement n'est visible
 * que par son créateur. L'utilisation de `$nin` couvre aussi un éventuel
 * groupe MongoDB dont le miroir PostgreSQL n'aurait pas encore été créé.
 */
export function buildTeacherGroupVisibilityFilter(
  userId: string,
  accessibleParcoursIds: number[],
  groupsWithParcours: GroupParcoursLinks[],
): FilterQuery<IGroup> {
  const accessibleParcours = new Set(accessibleParcoursIds);
  const attachedIds = attachedGroupIds(groupsWithParcours);
  const accessibleAttachedGroupIds = groupsWithParcours
    .filter(({ parcours }) =>
      parcours.some(({ parcoursId }) => accessibleParcours.has(parcoursId)),
    )
    .map(({ idMdb }) => idMdb);

  return {
    $or: [
      { _id: { $in: accessibleAttachedGroupIds } },
      {
        _id: { $nin: attachedIds },
        createdBy: userId,
      },
    ],
  };
}

/**
 * Les administrateurs voient tous les groupes. Les formateurs voient ceux de
 * leur périmètre et leurs propres groupes non rattachés. Les autres profils ne
 * voient jamais un groupe en attente de rattachement.
 */
export async function getGroupVisibilityFilter(
  auth: GroupAccessAuth,
): Promise<FilterQuery<IGroup>> {
  const userRank = Math.min(...auth.userRoles.map(({ rank }) => rank), 4);
  if (userRank <= 1) return {};

  const groupsWithParcoursPromise = prisma.group.findMany({
    select: {
      idMdb: true,
      parcours: { select: { parcoursId: true } },
    },
  });

  if (userRank !== 2) {
    return buildAttachedGroupVisibilityFilter(await groupsWithParcoursPromise);
  }

  const [scope, groupsWithParcours] = await Promise.all([
    resolveAccessScope(auth),
    groupsWithParcoursPromise,
  ]);

  return buildTeacherGroupVisibilityFilter(
    auth.userId,
    scope?.parcoursIds ?? [],
    groupsWithParcours,
  );
}

export async function canAccessGroups(
  auth: GroupAccessAuth,
  groupIds: string[],
) {
  const uniqueGroupIds = [...new Set(groupIds)];
  if (uniqueGroupIds.length === 0) return false;

  const userRank = Math.min(...auth.userRoles.map(({ rank }) => rank), 4);
  if (userRank <= 1) return true;

  const visibilityFilter = await getGroupVisibilityFilter(auth);
  const visibleGroupsCount = await Group.countDocuments({
    _id: { $in: uniqueGroupIds },
    ...visibilityFilter,
  });

  return visibleGroupsCount === uniqueGroupIds.length;
}
