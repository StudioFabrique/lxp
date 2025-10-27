import { Module, ModuleMetadata } from "@prisma/client";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

/**
 * Creates a new module with its metadata and associations
 *
 * This function creates both a Module and its corresponding ModuleMetadata
 * in a single transaction, ensuring data consistency. It also handles
 * associations with contacts and bonus skills through junction tables.
 *
 * The function processes the module creation in two steps:
 * 1. Creates the base Module entity with images and metadata
 * 2. Creates ModuleMetadata with duration, associations to parcours, and many-to-many relationships
 *
 * @param moduleToAdd - Module data including title, description, duration, contacts, and skills
 * @param thumb - Thumbnail image as base64 string (processed from uploaded file)
 * @param image - Full-size image as base64 string (processed from uploaded file)
 * @param userId - MongoDB ID of the user creating the module
 * @returns Promise<Object> - Object containing module ID, title, and base64 thumbnail
 * @throws Error with statusCode 404 if formation, user, or admin doesn't exist
 */
async function postModule(
  moduleToAdd: any,
  thumb: any,
  image: any,
  userId: string,
  moduleId: number | null = null
) {
  console.log("MODULE ID", moduleId);

  // Verify that the formation (parcours) exists before creating the module
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

  let existingModule: Module | null = null;

  if (!moduleId) {
    // ✅ Accéder au titre via la relation module
    const formationModules = existingFormation.modules.map((mod) => ({
      ...mod,
      title: mod.module.title, // Accès via la relation
    }));

    // Maintenant la vérification fonctionne
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
  } else {
    existingModule = await prisma.module.findFirst({
      where: { id: moduleId! },
    });

    if (!existingModule)
      throw {
        statusCode: 404,
        message: "MODULE_NOT_FOUND",
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
    // Step 1: Create the base Module entity with content and images
    if (!moduleId)
      newModule = await tx.module.create({
        data: {
          title: moduleToAdd.title,
          description: moduleToAdd.description,
          image, // Full-size image as base64 string
          thumb, // Thumbnail as base64 string (400x400px)
          author,
          adminId: existingAdmin!.id,
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
    newMetadataModule = await tx.moduleMetadata.create({
      data: {
        duration: moduleToAdd.duration, // Learning duration in hours
        // Link to the newly created module
        module: {
          connect: { id: !moduleId ? newModule!.id : moduleId },
        },
        // Link to the target parcours (learning path)
        parcours: { connect: { id: moduleToAdd.parcoursId } },
        // Link to the creating admin
        admin: { connect: { id: existingAdmin!.id } },
        // Create many-to-many relationships with contacts (instructors)
        // This creates records in the junction table ContactsOnModuleMetadata
        contacts: {
          create: moduleToAdd.contacts.map((contactId: number) => ({
            contact: { connect: { id: contactId } },
          })),
        },
        // Create many-to-many relationships with bonus skills
        // This creates records in the junction table BonusSkillsOnModuleMetadata
        bonusSkills: {
          create: moduleToAdd.skills.map((skillId: number) => ({
            bonusSkill: { connect: { id: skillId } },
          })),
        },
      },
      select: {
        id: true,
        duration: true,
        rating: true,
        minDate: true,
        maxDate: true,
        moduleId: true,
        createdAt: true,
        updatedAt: true,
        adminId: true,
        parcoursId: true,
        contacts: true,
        bonusSkills: true,
      },
    });

    // Return a simplified object for frontend consumption
    // This flattens the complex database structure for easier use
    return {
      id: newMetadataModule.id,
      title: moduleId ? existingModule!.title : newModule!.title,
      thumb: moduleId
        ? existingModule!.thumb?.toString("base64") ?? null
        : newModule!.thumb?.toString("base64") ?? null,
    };
  });

  return result;
}

export default postModule;
