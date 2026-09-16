import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";

export type AssignContactsToModulesInput = {
  parcoursId: number;
  moduleIds: number[];
  contactIds: number[];
};

/**
 * Ajoute des ressources pédagogiques à plusieurs modules d'un même parcours.
 * Les associations existantes sont conservées.
 */
export default async function assignContactsToModules(
  { parcoursId, moduleIds, contactIds }: AssignContactsToModulesInput,
  scope: AccessScope = null,
) {
  const uniqueModuleIds = [...new Set(moduleIds)];
  const uniqueContactIds = [...new Set(contactIds)];
  const accessWhere = moduleWhereForScope(scope);

  return prisma.transaction(async (tx) => {
    const [moduleCount, contactCount] = await Promise.all([
      tx.orm.public.Module.where((row) =>
        whereFromObject(row, {
          id: { in: uniqueModuleIds },
          parcoursId,
          ...(accessWhere ? { AND: [accessWhere] } : {}),
        }),
      )
        .aggregate((aggregate) => ({ total: aggregate.count() }))
        .then(({ total }) => total),
      tx.orm.public.ContactsOnParcours.where((row) =>
        whereFromObject(row, {
          parcoursId,
          contactId: { in: uniqueContactIds },
        }),
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
    if (contactCount !== uniqueContactIds.length) {
      throw {
        statusCode: 400,
        message:
          "Une ou plusieurs ressources pédagogiques n'appartiennent pas au parcours.",
      };
    }

    return tx.orm.public.ContactsOnModule.createAndCount(
      uniqueModuleIds.flatMap((moduleId) =>
        uniqueContactIds.map((contactId) => ({ moduleId, contactId })),
      ),
    ).then((count) => ({ count }));
  });
}
