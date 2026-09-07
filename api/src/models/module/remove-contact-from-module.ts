import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export type RemoveContactFromModuleInput = {
  parcoursId: number;
  moduleId: number;
  contactId: number;
};

export default async function removeContactFromModule(
  { parcoursId, moduleId, contactId }: RemoveContactFromModuleInput,
  scope: AccessScope = null,
  requesterUserId?: string,
) {
  const accessWhere = moduleWhereForScope(scope);

  return prisma.$transaction(async (tx) => {
    const [moduleCount, requesterContact] = await Promise.all([
      tx.module.count({
        where: {
          id: moduleId,
          parcoursId,
          ...(accessWhere ? { AND: [accessWhere] } : {}),
        },
      }),
      scope?.kind === "teacher" && requesterUserId
        ? tx.contact.findUnique({
            where: { idMdb: requesterUserId },
            select: { id: true },
          })
        : null,
    ]);

    if (moduleCount !== 1) {
      throw {
        statusCode: 400,
        message: "Le module n'appartient pas au parcours.",
      };
    }

    if (requesterContact?.id === contactId) {
      throw {
        statusCode: 400,
        message:
          "Vous devez rester affecté au module pour pouvoir continuer à le gérer.",
      };
    }

    const result = await tx.contactsOnModule.deleteMany({
      where: { moduleId, contactId },
    });
    if (result.count === 0) {
      throw {
        statusCode: 404,
        message: "Cette ressource pédagogique n'est pas affectée au module.",
      };
    }

    return result;
  });
}
