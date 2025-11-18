import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function postModuleMetadata(
  moduleId: number,
  parcoursId: number,
  contactIds: number[],
  skillIds: number[],
  userId: string
) {
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
  });

  if (!existingParcours) {
    throw { statusCode: 404, message: "Parcours not found" };
  }

  const existingModule = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!existingModule) {
    throw { statusCode: 404, message: "Module not found" };
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    throw { statusCode: 404, message: "Admin not found" };
  }

  const newModuleMetadata = await prisma.moduleMetadata.create({
    data: {
      moduleId,
      parcoursId,
      adminId: existingAdmin.id,
      // ✅ Créer via la table de jointure
      contacts: {
        create: contactIds.map((contactId) => ({
          contact: {
            connect: { id: contactId },
          },
        })),
      },
      // ✅ Même approche pour skills
      bonusSkills: {
        create: skillIds.map((skillId) => ({
          bonusSkill: {
            connect: { id: skillId },
          },
        })),
      },
    },
  });

  return newModuleMetadata;
}
