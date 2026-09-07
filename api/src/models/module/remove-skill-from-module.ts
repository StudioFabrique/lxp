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

  return prisma.$transaction(async (tx) => {
    const moduleCount = await tx.module.count({
      where: {
        id: moduleId,
        parcoursId,
        ...(accessWhere ? { AND: [accessWhere] } : {}),
      },
    });
    if (moduleCount !== 1) {
      throw {
        statusCode: 400,
        message: "Le module n'appartient pas au parcours.",
      };
    }

    const result = await tx.bonusSkillsOnModule.deleteMany({
      where: { moduleId, bonusSkillId: skillId },
    });
    if (result.count === 0) {
      throw {
        statusCode: 404,
        message: "Cette compétence n'est pas associée au module.",
      };
    }

    return result;
  });
}
