import { and } from "@prisma/orm-postgres/orm-client";
import { prisma } from "../../utils/db.ts";
import type { AccessScope } from "../../utils/services/permissions/accessible-parcours.ts";

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
  return prisma.transaction(async (tx) => {
    const [moduleCount, requesterContact] = await Promise.all([
      tx.orm.public.Module.where((row) =>
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
        .then(({ total }) => total),
      scope?.kind === "teacher" && requesterUserId
        ? tx.orm.public.Contact.where({ idMdb: requesterUserId })
            .select("id")
            .first()
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

    const result = await tx.orm.public.ContactsOnModule.where({
      moduleId,
      contactId,
    })
      .deleteAndCount()
      .then((count) => ({ count }));
    if (result.count === 0) {
      throw {
        statusCode: 404,
        message: "Cette ressource pédagogique n'est pas affectée au module.",
      };
    }

    return result;
  });
}
