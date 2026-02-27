import { Module, ModuleMetadata } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

/**
 * Creates a new module or duplicates an existing module with its metadata and associations
 *
 * This function handles two scenarios:
 * 1. Creating a brand new module (when moduleId is null/NaN)
 * 2. Duplicating an existing module to another parcours (when moduleId is provided)
 *
 * For both scenarios, it creates ModuleMetadata in a single transaction, ensuring data consistency.
 * It also handles associations with contacts and bonus skills through junction tables.
 *
 * Creation process:
 * 1. Validates that the formation exists
 * 2. Checks for duplicate module titles (only for new modules)
 * 3. Creates the base Module entity with images and metadata (only for new modules)
 * 4. Creates ModuleMetadata with duration, associations to parcours, and many-to-many relationships
 *
 * Duplication process:
 * 1. Validates that the formation and source module exist
 * 2. Reuses the existing module's data (title, images, etc.)
 * 3. Creates new ModuleMetadata linked to the existing module but for a different parcours
 *
 * @param moduleToAdd - Module data including title, description, duration, contacts, skills, formationId, and parcoursId
 * @param thumb - Thumbnail image as base64 string (processed from uploaded file) or null
 * @param image - Full-size image as base64 string (processed from uploaded file) or null
 * @param userId - MongoDB ID of the user creating/duplicating the module
 * @param moduleId - Optional ID of an existing module to duplicate (null or NaN for new modules)
 * @returns Promise<Object> - Object containing module metadata ID, title, and base64 thumbnail
 * @throws Error with statusCode 404 if formation, module (for duplication), user, or admin doesn't exist
 * @throws Error with statusCode 406 if a module with the same title already exists in the formation
 */
async function postModule(
  moduleToAdd: any,
  thumb: any,
  image: any,
  userId: string
) {
  console.log("toto champion", moduleToAdd);

  // Verify that the formation (parcours) exists before creating/duplicating the module
  const existingFormation = await prisma.formation.findFirst({
    where: { id: moduleToAdd.formationId },
    select: {
      modules: {
        select: {
          module: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });

  if (!existingFormation)
    throw {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };

  // Variable to store existing module data when duplicating
  let existingModule: Module | null = null;

  // NEW MODULE CREATION PATH
  // Extract module titles from the formation's modules via the relation
  const formationModules = existingFormation.modules.map((mod) => ({
    ...mod,
    title: mod.module.title, // Access title through the module relation
  }));

  // Check if a module with the same title already exists in this formation
  // Case-insensitive comparison with trimmed strings
  if (
    formationModules.some(
      (mod) =>
        mod.title.trim().toLowerCase() ===
        moduleToAdd.title.trim().toLowerCase()
    )
  ) {
    throw {
      statusCode: 406,
      message: "MODULE_ALREADY_EXISTS",
    };
  }

  // Fetch user details from MongoDB to construct the author name
  // This bridges the MongoDB user system with PostgreSQL module storage
  const existingUser = await User.findById(userId, {
    firstname: 1,
    lastname: 1,
  });

  if (!existingUser)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  // Find corresponding admin record in PostgreSQL
  // The admin table links MongoDB users to PostgreSQL entities
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin)
    throw { message: "L'administrateur n'existe pas.", statusCode: 404 };

  // Construct full author name for display purposes
  const author = `${existingUser?.firstname} ${existingUser?.lastname}`;

  // Declare variables for TypeScript type safety (will be assigned in transaction)
  let newMetadataModule: ModuleMetadata | null = null;
  let newModule: Module | null = null;

  // Use transaction to ensure both Module and ModuleMetadata are created atomically
  // This prevents orphaned records if one creation fails
  const result = await prisma.$transaction(async (tx) => {
    // Step 1: Create the base Module entity (only for new modules, not duplicates)

    newModule = await tx.module.create({
      data: {
        title: moduleToAdd.title,
        description: moduleToAdd.description,
        image, // Full-size image as base64 string
        thumb, // Thumbnail as base64 string (400x400px)
        author,
        adminId: existingAdmin!.id,
        // Create the many-to-many relationship with formations
        formations: { create: { formationId: moduleToAdd.formationId } },
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        thumb: true,
        createdAt: true,
        updatedAt: true,
        author: true,
        adminId: true,
      },
    });

    // Step 2: Create ModuleMetadata with associations and many-to-many relationships
    // For duplication, this links the existing module to a new parcours
    // For new modules, this links the newly created module to the target parcours

    if (moduleToAdd.parcoursId) {
      newMetadataModule = await tx.moduleMetadata.create({
        data: {
          duration: moduleToAdd.duration ?? 0,
          module: {
            connect: { id: newModule!.id },
          },
          parcours: { connect: { id: moduleToAdd.parcoursId } },
          admin: { connect: { id: existingAdmin!.id } },
          // ✅ Gérer les cas où les tableaux sont undefined
          contacts: {
            create: (moduleToAdd.contacts ?? []).map((contactId: number) => ({
              contact: { connect: { id: contactId } },
            })),
          },
          bonusSkills: {
            create: (moduleToAdd.skills ?? []).map((skillId: number) => ({
              bonusSkill: { connect: { id: skillId } },
            })),
          },
        },
      });

      const moduleMetadata = await tx.moduleMetadata.findFirst({
        where: { id: newMetadataModule.id },
        include: {
          contacts: {
            include: { contact: true },
          },
          bonusSkills: {
            include: { bonusSkill: true },
          },
        },
      });
      if (!moduleMetadata)
        throw {
          message: "Erreur lors de la création des métadonnées.",
          statusCode: 500,
        };

      // Return a simplified object for frontend consumption
      // This flattens the complex database structure for easier use
      // Uses data from either the new module or the existing module being duplicated
      return {
        id: newMetadataModule.id,
        title: newModule!.title,
        description: newModule!.description,
        thumb: newModule!.thumb
          ? Buffer.from(newModule!.thumb as any).toString("base64")
          : null,
        duration: newMetadataModule.duration,
        contacts: moduleMetadata.contacts.map((c) => c.contact),
        skills: moduleMetadata.bonusSkills.map((b) => b.bonusSkill),
      };
    }

    console.log(newModule.thumb);
    // Fallback return (should reach here if no parcoursId provided, meaning the user did not want yet to link to a parcours)
    return {
      id: newModule!.id,
      title: newModule!.title,
      description: newModule!.description,
      thumb: newModule!.thumb
        ? Buffer.from(newModule!.thumb as any).toString("base64")
        : null,
    };
  });

  return result;
}

export default postModule;
