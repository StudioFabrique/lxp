import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export type RemoveSkillFromModuleInput = {
  parcoursId: number;
  moduleId: number;
  skillId: number;
};

export default async function removeSkillFromModule(
  { parcoursId, moduleId, skillId }: RemoveSkillFromModuleInput,
  scope: AccessScope = null,
) {
  const accessWhere = moduleWhereForScope(scope);

  return prisma.transaction(async (tx) => {
    const moduleCount = await tx.orm.public.Module.where((row) =>
      whereFromObject(row, {
        id: moduleId,
        parcoursId,
        ...(accessWhere ? { AND: [accessWhere] } : {}),
      }),
    )
      .aggregate((aggregate) => ({ total: aggregate.count() }))
      .then(({ total }) => total);
    if (moduleCount !== 1) {
      throw {
        statusCode: 400,
        message: "Le module n'appartient pas au parcours.",
      };
    }

    const result = await tx.orm.public.BonusSkillsOnModule.where((row) =>
      whereFromObject(row, { moduleId, bonusSkillId: skillId }),
    )
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
