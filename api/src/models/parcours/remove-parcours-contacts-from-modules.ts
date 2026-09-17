import { and } from "@prisma/orm-postgres/orm-client";

import type { TransactionClient } from "../../utils/db.ts";

/**
 * Retire des modules du parcours les formateurs qui viennent d'être retirés
 * de ses ressources pédagogiques globales.
 *
 * Sans ce nettoyage, l'affectation résiduelle au module continue d'ouvrir le
 * parcours parent au formateur dans son dashboard et dans sa liste.
 */
export async function removeParcoursContactsFromModules(
  tx: TransactionClient,
  parcoursId: number,
  contactIds: number[],
) {
  if (contactIds.length === 0) return;

  await tx.orm.public.ContactsOnModule.where((row) =>
    and(
      row.contactId.in(contactIds),
      row.module.some((module) => module.parcoursId.eq(parcoursId)),
    ),
  )
    .deleteAndCount()
    .then((count) => ({ count }));
}
