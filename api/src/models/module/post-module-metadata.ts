import { prisma } from "../../utils/db";

/**
 * Creates module metadata and associates it with contacts and skills
 *
 * This function handles the second step of module attachment to a parcours:
 * 1. Validates that the parcours, module, and admin exist
 * 2. Creates a new ModuleMetadata record
 * 3. Associates contacts and skills via junction tables
 *
 * The ModuleMetadata entity represents the instance of a module within a specific parcours,
 * allowing for parcours-specific configurations (duration, contacts, skills).
 *
 * @param moduleId - ID of the module to attach
 * @param parcoursId - ID of the parcours to attach the module to
 * @param contactIds - Array of contact IDs to associate with this module metadata
 * @param skillIds - Array of skill IDs to associate with this module metadata
 * @param userId - MongoDB user ID of the admin performing this action
 * @returns The newly created ModuleMetadata object with relations
 * @throws {Object} Error object with statusCode 404 if parcours, module, or admin not found
 */
export default async function postModuleMetadata(
  moduleId: number,
  parcoursId: number,
  contactIds: number[],
  skillIds: number[],
  userId: string
) {
  // Validate that the target parcours exists
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: parcoursId },
  });

  if (!existingParcours) {
    throw { statusCode: 404, message: "Parcours not found" };
  }

  // Validate that the module to attach exists
  const existingModule = await prisma.module.findUnique({
    where: { id: moduleId },
  });

  if (!existingModule) {
    throw { statusCode: 404, message: "Module not found" };
  }

  // Validate that the admin performing this action exists
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin) {
    throw { statusCode: 404, message: "Admin not found" };
  }

  // Create the module metadata and associate contacts and skills via junction tables
  const newModuleMetadata = await prisma.moduleMetadata.create({
    data: {
      moduleId,
      parcoursId,
      adminId: existingAdmin.id,
      // Create contact associations via ContactsOnModuleMetadata junction table
      contacts: {
        create: contactIds.map((contactId) => ({
          contact: {
            connect: { id: contactId },
          },
        })),
      },
      // Create skill associations via BonusSkillsOnModuleMetadata junction table
      bonusSkills: {
        create: skillIds.map((skillId) => ({
          bonusSkill: {
            connect: { id: skillId },
          },
        })),
      },
    },
    select: {
      id: true,
      module: {
        select: { id: true, title: true, thumb: true, description: true },
      },
      contacts: {
        select: { contact: { select: { id: true, name: true } } },
      },
      bonusSkills: {
        select: {
          bonusSkill: { select: { id: true, description: true } },
        },
      },
    },
  });

  return {
    id: newModuleMetadata.id,
    title: newModuleMetadata.module.title,
    thumb: newModuleMetadata.module.thumb
      ? Buffer.from(newModuleMetadata.module.thumb as any).toString("base64")
      : null,
    description: newModuleMetadata.module.description,
    contacts: newModuleMetadata.contacts.map((c) => ({
      id: c.contact.id,
      name: c.contact.name,
    })),
    bonusSkills: newModuleMetadata.bonusSkills.map((s) => ({
      id: s.bonusSkill.id,
      description: s.bonusSkill.description,
    })),
  };
}
