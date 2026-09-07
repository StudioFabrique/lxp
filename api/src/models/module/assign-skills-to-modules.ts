import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

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
  const accessWhere = moduleWhereForScope(scope);

  return prisma.$transaction(async (tx) => {
    const [moduleCount, skillCount] = await Promise.all([
      tx.module.count({
        where: {
          id: { in: uniqueModuleIds },
          parcoursId,
          ...(accessWhere ? { AND: [accessWhere] } : {}),
        },
      }),
      tx.bonusSkill.count({
        where: { parcoursId, id: { in: uniqueSkillIds } },
      }),
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

    return tx.bonusSkillsOnModule.createMany({
      data: uniqueModuleIds.flatMap((moduleId) =>
        uniqueSkillIds.map((bonusSkillId) => ({ moduleId, bonusSkillId })),
      ),
      skipDuplicates: true,
    });
  });
}
