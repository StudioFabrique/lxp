import { prisma } from "../../utils/db";

/**
 * Retrieves detailed information about a specific module with user progress tracking
 *
 * This function fetches comprehensive module data including metadata, associated parcours,
 * courses, lessons, and tracks the user's reading progress through lessons. It provides
 * all necessary information for displaying a module's content and the user's progress.
 *
 * @param moduleId - The unique identifier of the module metadata to retrieve
 * @param userMongoId - The MongoDB ID of the user for progress tracking
 * @returns Promise<Object> - Complete module details with user progress information
 * @throws Error with message and statusCode 404 if module doesn't exist
 */
export default async function getModuleDetail(
  moduleId: number,
  userMongoId: string
) {
  // Fetch module with all related data and user progress tracking
  const existingModule = await prisma.moduleMetadata.findFirst({
    where: { id: moduleId },
    select: {
      // Core module metadata
      id: true,
      duration: true,
      minDate: true,
      maxDate: true,

      // Associated parcours information
      parcours: {
        select: { id: true, title: true },
      },

      // Core module information
      module: {
        select: { title: true, description: true, image: true, id: true },
      },

      // Module relationships
      bonusSkills: { select: { bonusSkill: true } },
      contacts: { select: { contact: true } },

      // Courses with lessons and user progress tracking
      courses: {
        select: {
          id: true,
          title: true,
          description: true,
          lessons: {
            include: {
              // Include user's reading progress for each lesson
              lessonsRead: {
                where: { student: { idMdb: userMongoId } },
              },
            },
            // Order lessons by their sequence
            orderBy: {
              order: "asc",
            },
          },
        },
        // Order courses by their sequence
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Validate module existence
  if (!existingModule) {
    const error: any = { message: "Le module n'existe pas.", statusCode: 404 };
    throw error;
  }

  // Transform and structure the response data
  const result = {
    // Module core information
    id: existingModule.id,
    title: existingModule.module.title,
    description: existingModule.module.description,
    // Convert image buffer to base64 string for frontend consumption
    image: existingModule.module.image?.toString("base64") ?? null,

    // Module timing and scheduling information
    duration: existingModule.duration,
    minDate: existingModule.minDate,
    maxDate: existingModule.maxDate,

    // Associated parcours information
    parcours: existingModule.parcours.title,
    parcoursId: existingModule.parcours.id,

    // Module relationships (flattened for easier frontend consumption)
    bonusSkills: existingModule.bonusSkills.map((item) => item.bonusSkill),
    contacts: existingModule.contacts.map((item) => item.contact),

    // Courses with embedded lessons and progress tracking
    courses: existingModule.courses,
  };

  return result;
}
