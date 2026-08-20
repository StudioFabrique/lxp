import { PrismaClient } from "@prisma/client";
import Group from "../../src/utils/interfaces/db/group.ts";
import Role from "../../src/utils/interfaces/db/role.ts";

const prisma = new PrismaClient();

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
  await prisma.parcours.update({
    where: { id: parcoursId },
    data: { isPublished: true },
  });

  const studentRole = await Role.findOne({ role: "student" });
  const mongoGroup = await Group.create({
    name: `Groupe de test ${parcoursId}`,
    users: [userIdMdb],
    roles: [studentRole!._id],
    isActive: true,
  });
  const mongoGroupId = mongoGroup.id as string;

  const pgGroup = await prisma.group.create({
    data: { idMdb: mongoGroupId },
    select: { id: true },
  });
  await prisma.groupsOnParcours.create({
    data: { groupId: pgGroup.id, parcoursId },
  });

  return {
    cleanup: async () => {
      await prisma.groupsOnParcours.deleteMany({ where: { groupId: pgGroup.id } });
      await prisma.group.deleteMany({ where: { id: pgGroup.id } });
      await Group.deleteOne({ _id: mongoGroupId });
    },
  };
}
