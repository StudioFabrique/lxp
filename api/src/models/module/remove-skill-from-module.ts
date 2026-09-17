import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

export type RemoveSkillFromModuleInput = {
  parcoursId: number;
  moduleId: number;
  skillId: number;
};

export default async function removeSkillFromModule(
  { parcoursId, moduleId, skillId }: RemoveSkillFromModuleInput,
  scope: AccessScope = null,
) {
  return prisma.transaction(async (tx) => {
    const moduleCount = await tx.orm.public.Module.where((row) =>
      and(
        row.id.eq(moduleId),
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
      .then(({ total }) => total);
    if (moduleCount !== 1) {
      throw {
        statusCode: 400,
        message: "Le module n'appartient pas au parcours.",
      };
    }

    const result = await tx.orm.public.BonusSkillsOnModule.where({
      moduleId,
      bonusSkillId: skillId,
    })
      .deleteAndCount()
      .then((count) => ({ count }));
    if (result.count === 0) {
      throw {
        statusCode: 404,
        message: "Cette compétence n'est pas associée au module.",
      };
    }

    return result;
  });
}
