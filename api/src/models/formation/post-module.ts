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
 * @param moduleToAdd - Module data including title, description, duration, etc.
 * @param thumb - Thumbnail image buffer
 * @param image - Full-size image buffer
 * @param userId - MongoDB ID of the user creating the module
 * @returns Promise<ModuleMetadata> - The created module metadata
 * @throws Error with statusCode 404 if formation, user, or admin doesn't exist
 */
async function postModule(
  moduleToAdd: any,
  thumb: any,
  image: any,
  userId: string
) {
  // Verify that the formation (parcours) exists
  const existingParcours = await prisma.formation.findFirst({
    where: { id: moduleToAdd.formationId },
  });

  if (!existingParcours)
    throw {
      message: "Le parcours de formation n'existe pas.",
      statusCode: 404,
    };

  // Fetch user details from MongoDB for author name
  const existingUser = await User.findById(userId, {
    firstname: 1,
    lastname: 1,
  });

  if (!existingUser)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  // Find corresponding admin in PostgreSQL
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin)
    throw { message: "L'administrateur n'existe pas.", statusCode: 404 };

  const author = `${existingUser?.firstname} ${existingUser?.lastname}`;

  let newMetadataModule: ModuleMetadata | null = null;
  let newModule: Module | null = null;

  // Use transaction to ensure both Module and ModuleMetadata are created together
  const result = await prisma.$transaction(async (tx) => {
    // Step 1: Create the base Module
    const newModule = await tx.module.create({
      data: {
        title: moduleToAdd.title,
        description: moduleToAdd.description,
        image,
        thumb,
        author,
        adminId: existingAdmin!.id,
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

    // Step 2: Create ModuleMetadata
    const newMetadataModule = await tx.moduleMetadata.create({
      data: {
        duration: moduleToAdd.duration,
        module: { connect: { id: newModule.id } },
        parcours: { connect: { id: existingParcours!.id } },
        admin: { connect: { id: existingAdmin!.id } },
        contacts: {
          create: moduleToAdd.contacts.map((contactId: number) => ({
            contact: { connect: { id: contactId } },
          })),
        },
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

    // ✅ Retourner directement le résultat
    return {
      id: newMetadataModule.id,
      title: newModule.title,
      thumb: newModule.thumb?.toString("base64") ?? null,
    };
  });

  return result;
}

export default postModule;
