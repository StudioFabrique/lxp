import { requireDatabaseRow } from "../../src/utils/require-database-row.ts";
import { createPrismaClient } from "../../src/utils/create-prisma-client.ts";
import Group from "../../src/utils/interfaces/db/group.ts";
import Role from "../../src/utils/interfaces/db/role.ts";

const prisma = createPrismaClient();

export type Enrollment = { cleanup: () => Promise<void> };

/**
 * Rattache un apprenant à un parcours, comme le ferait l'application.
 *
 * L'inscription n'est pas un simple champ : l'appartenance au groupe vit dans
 * Mongo, le rattachement du groupe au parcours dans PostgreSQL, et les deux
 * sont reliés par `idMdb`. Les suites qui manipulent des contenus doivent
 * reproduire ce montage, faute de quoi le cloisonnement mis en place par
 * `check-content-access` leur répond 404 — à raison.
 */
export async function enrollStudentInParcours(
  userIdMdb: string,
  parcoursId: number,
): Promise<Enrollment> {
  // Le parcours doit être publié : c'est la condition que `getAccessibleParcoursIds`
  // applique, et que la liste des parcours d'un apprenant applique déjà.
  await prisma.orm.public.Parcours.where({ id: parcoursId })
    .update({ isPublished: true })
    .then(requireDatabaseRow);

  const studentRole = await Role.findOne({ role: "student" });
  const mongoGroup = await Group.create({
    name: `Groupe de test ${parcoursId}`,
    users: [userIdMdb],
    roles: [studentRole!._id],
    isActive: true,
  });
  const mongoGroupId = mongoGroup.id as string;

  const pgGroup = await prisma.orm.public.Group.select("id").create({
    idMdb: mongoGroupId,
  });
  await prisma.orm.public.GroupsOnParcours.create({
    groupId: pgGroup.id,
    parcoursId,
  });

  return {
    cleanup: async () => {
      await prisma.orm.public.GroupsOnParcours.where({ groupId: pgGroup.id })
        .deleteAndCount()
        .then((count) => ({ count }));
      await prisma.orm.public.Group.where({ id: pgGroup.id })
        .deleteAndCount()
        .then((count) => ({ count }));
      await Group.deleteOne({ _id: mongoGroupId });
    },
  };
}
