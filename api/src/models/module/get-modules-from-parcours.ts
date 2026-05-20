import { prisma } from "../../utils/db";

/**
 * Retrieves all modules associated with a specific parcours along with available resources
 *
 * This function fetches:
 * 1. All modules linked to the parcours with their metadata (duration, contacts, skills)
 * 2. The formation ID that the parcours belongs to
 * 3. Available contacts (instructors) that can be assigned to modules in this parcours
 * 4. Available bonus skills that can be earned through modules in this parcours
 *
 * The returned data is used to:
 * - Display existing modules in the parcours
 * - Populate dropdowns for creating/editing modules with available contacts and skills
 * - Maintain the relationship between parcours and its parent formation
 *
 * @param parcoursId - ID of the parcours (learning path) to retrieve modules from
 * @returns Promise<Object> - Object containing:
 *   - modules: Array of module data with formatted contacts and skills
 *   - parcoursData: Formation ID and available resources (contacts, bonus skills)
 * @throws Error with statusCode 404 if parcours doesn't exist
 */
async function getModulesFromParcours(parcoursId: number) {
  // Fetch parcours with all related data using Prisma's nested select
  const existingParcours = await prisma.parcours.findUnique({
    where: { id: +parcoursId },
    select: {
      // Modules associated with this parcours (through ModuleMetadata)
      modules: {
        select: {
          id: true,
          duration: true, // Learning duration in hours
          // Many-to-many relationship: contacts assigned to this module instance
          contacts: {
            select: {
              contact: { select: { id: true, name: true, role: true } },
            },
          },
          // Many-to-many relationship: bonus skills earned from this module instance
          bonusSkills: {
            select: { bonusSkill: { select: { id: true, description: true } } },
          },
          // Reference to the base Module entity (shared across parcours)
          module: {
            select: {
              title: true,
              thumb: true, // Thumbnail image as Buffer
              description: true,
              quizInstructions: true,
            },
          },
        },
      },
      // Formation (training program) that contains this parcours
      formation: { select: { id: true } },
      // Available contacts that can be assigned to modules in this parcours
      contacts: {
        select: {
          contact: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
      // Available bonus skills that can be earned in this parcours
      bonusSkills: true,
    },
  });

  // Guard clause: ensure parcours exists
  if (!existingParcours)
    throw { statusCode: 404, message: "Parcours introuvable." };

  // Transform modules data into a flattened structure for frontend consumption
  const modules =
    existingParcours?.modules.map((mod) => ({
      id: mod.id, // ModuleMetadata ID (unique per parcours)
      title: mod.module.title, // Module title from base Module entity
      // Convert Buffer/Uint8Array to base64 in a TS-safe way
      thumb: mod.module.thumb
        ? Buffer.from(mod.module.thumb as any).toString("base64")
        : null,
      description: mod.module.description,
      quizInstructions: mod.module.quizInstructions,
      duration: mod.duration, // Duration specific to this parcours instance
      // Flatten contacts from many-to-many relationship
      contacts: mod.contacts.map((c) => ({
        id: c.contact.id,
        name: c.contact.name,
        role: c.contact.role,
      })),
      // Flatten bonus skills from many-to-many relationship
      skills: mod.bonusSkills.map((s) => ({
        id: s.bonusSkill.id,
        description: s.bonusSkill.description,
      })),
    })) ?? [];

  // Prepare parcours-level data for frontend
  // This provides the available resources for creating/editing modules
  const parcoursData = {
    formationId: existingParcours.formation.id, // Parent formation ID
    // Flatten available contacts (instructors pool)
    contacts: existingParcours.contacts.map((c) => c.contact),
    // Available bonus skills (skills pool)
    bonusSkills: existingParcours.bonusSkills,
  };

  return { modules, parcoursData };
}

export default getModulesFromParcours;
