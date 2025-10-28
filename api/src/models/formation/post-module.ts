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
  userId: string,
  moduleId: number | null = null
) {
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

  let moduleToCopy: any | null = null;

  console.log("MODULE ID", moduleId);

  if (moduleId)
    moduleToCopy = await prisma.moduleMetadata.findFirst({
      where: { id: moduleId },
      select: {
        // Module basic information

        duration: true,
        rating: true,
        admin: {
          select: {
            id: true,
          },
        },
        // Module relationships
        bonusSkills: {
          select: {
            bonusSkill: {
              select: {
                id: true,
              },
            },
          },
        },
        contacts: {
          select: {
            contact: {
              select: {
                id: true,
              },
            },
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            thumb: true,
          },
        },
        // Courses within modules
        courses: {
          select: {
            // Course basic information
            title: true,
            description: true,
            image: true,
            virtualClass: true,
            scenario: true,
            order: true,
            author: true,
            admin: {
              select: {
                id: true,
              },
            },
            // Course relationships

            contacts: {
              select: {
                contact: {
                  select: {
                    id: true,
                  },
                },
              },
            },

            tags: {
              select: {
                tag: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            // Lessons within courses
            lessons: {
              select: {
                // Lesson basic information
                title: true,
                description: true,
                modalite: true,
                author: true,
                admin: {
                  select: {
                    id: true,
                  },
                },
                tag: {
                  select: {
                    id: true,
                  },
                },
                order: true,
                // Activities within lessons
                activities: {
                  select: {
                    title: true,
                    description: true,
                    order: true,
                    type: true,
                    url: true,
                    author: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  console.log({ moduleToCopy });

  if (!existingFormation)
    throw {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };

  // Variable to store existing module data when duplicating
  let existingModule: Module | null = null;

  // Branch logic based on whether we're creating a new module or duplicating an existing one
  if (!moduleId) {
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
  } else {
    // MODULE DUPLICATION PATH
    // Fetch the existing module to duplicate
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
    // Step 1: Create the base Module entity (only for new modules, not duplicates)
    if (!moduleId)
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

    console.log(moduleToCopy);

    newMetadataModule = await tx.moduleMetadata.create({
      data: {
        ...moduleToCopy,
        duration: moduleToAdd.duration, // Learning duration in hours
        // Link to either the newly created module or the existing module being duplicated
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
    // Uses data from either the new module or the existing module being duplicated
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
