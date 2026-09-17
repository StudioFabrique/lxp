import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export type AssignSkillsToModulesInput = {
  parcoursId: number;
  moduleIds: number[];
  skillIds: number[];
};

/**
 * Ajoute des compétences à plusieurs modules d'un même parcours.
 * Les associations existantes sont conservées.
 */
export default async function assignSkillsToModules(
  { parcoursId, moduleIds, skillIds }: AssignSkillsToModulesInput,
  scope: AccessScope = null,
) {
  const uniqueModuleIds = [...new Set(moduleIds)];
  const uniqueSkillIds = [...new Set(skillIds)];
  return prisma.transaction(async (tx) => {
    const [moduleCount, skillCount] = await Promise.all([
      tx.orm.public.Module.where((row) =>
        and(
          row.id.in(uniqueModuleIds),
          row.parcoursId.eq(parcoursId),
          ...(scope
            ? [
                scope.moduleIds === null
                  ? row.parcoursId.in(scope.parcoursIds)
                  : row.id.in(scope.moduleIds),
              ]
            : []),
        ),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
      tx.orm.public.BonusSkill.where((row) =>
        and(row.parcoursId.eq(parcoursId), row.id.in(uniqueSkillIds)),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
    ]);

    if (moduleCount !== uniqueModuleIds.length) {
      throw {
        statusCode: 400,
        message: "Un ou plusieurs modules n'appartiennent pas au parcours.",
      };
    }
    if (skillCount !== uniqueSkillIds.length) {
      throw {
        statusCode: 400,
        message:
          "Une ou plusieurs compétences n'appartiennent pas au parcours.",
      };
    }

    return tx.orm.public.BonusSkillsOnModule.createAndCount(
      uniqueModuleIds.flatMap((moduleId) =>
        uniqueSkillIds.map((bonusSkillId) => ({ moduleId, bonusSkillId })),
      ),
    ).then((count) => ({ count }));
  });
}
