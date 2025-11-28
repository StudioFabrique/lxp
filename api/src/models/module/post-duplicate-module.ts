import { prisma } from "../../utils/db";

/**
 * Duplicates a module metadata instance to a new parcours with all its nested content
 *
 * This function performs a deep copy of a module metadata including:
 * - Module metadata (duration, rating, relationships)
 * - Associated contacts and bonus skills (using provided IDs instead of originals)
 * - All courses within the module
 * - All lessons within each course
 * - All activities within each lesson
 *
 * The duplication creates new database records for courses, lessons, and activities
 * while maintaining the original module reference. This allows the same base module
 * to exist in multiple parcours with different content instances.
 *
 * Key differences from original:
 * - Uses new admin (current user) instead of original admin
 * - Uses provided contacts and skills IDs instead of copying originals
 * - Creates new instances of all nested content (courses, lessons, activities)
 *
 * @param originalModuleMetadataId - ID of the module metadata to duplicate
 * @param metadatas - Object containing arrays of contact and skill IDs to associate
 * @param metadatas.contactsIds - Array of contact IDs to link to the new module instance
 * @param metadatas.skillsIds - Array of bonus skill IDs to link to the new module instance
 * @param userId - MongoDB ID of the user performing the duplication
 * @param parcoursId - ID of the target parcours where the module will be duplicated
 * @returns Promise<ModuleMetadata> - The newly created module metadata with all relations
 * @throws Error with statusCode 404 if user/admin doesn't exist
 * @throws Error with status 404 if original module metadata doesn't exist
 */
export default async function postDuplicateModule(
  originalModuleMetadataId: number,
  metadatas: { contactsIds: number[]; skillsIds: number[] },
  userId: string,
  parcoursId: number
) {
  // Verify that the user exists and get their admin ID
  // The admin table links MongoDB users to PostgreSQL entities
  const existingAdmin = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  if (!existingAdmin)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  // Fetch the complete module metadata structure to duplicate
  // This includes all nested relationships: courses, lessons, and activities
  const existingModuleMetadata = await prisma.moduleMetadata.findFirst({
    where: { id: originalModuleMetadataId },
    select: {
      // Module metadata properties
      duration: true, // Learning duration in hours
      rating: true, // Module rating
      admin: {
        select: {
          id: true, // Original admin who created this instance
        },
      },
      // Many-to-many relationship: Bonus skills earned from this module
      bonusSkills: {
        select: {
          bonusSkill: {
            select: {
              id: true,
            },
          },
        },
      },
      // Many-to-many relationship: Contacts (instructors) assigned to this module
      contacts: {
        select: {
          contact: {
            select: {
              id: true,
            },
          },
        },
      },
      // Reference to base Module entity (shared across parcours)
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          image: true, // Full-size image as Buffer
          thumb: true, // Thumbnail as Buffer
        },
      },
      // Courses within this module (will be deep copied)
      courses: {
        select: {
          // Course basic information
          title: true,
          description: true,
          image: true, // Course image
          virtualClass: true, // Virtual classroom link
          scenario: true, // Course scenario/storyline
          order: true, // Display order within module
          author: true, // Author name
          admin: {
            select: {
              id: true, // Admin who created the course
            },
          },
          // Course relationships

          // Many-to-many: Contacts assigned to this course
          contacts: {
            select: {
              contact: {
                select: {
                  id: true,
                },
              },
            },
          },

          // Many-to-many: Tags categorizing this course
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                },
              },
            },
          },
          // Lessons within this course (will be deep copied)
          lessons: {
            select: {
              // Lesson basic information
              title: true,
              description: true,
              modalite: true, // Learning modality (synchronous/asynchronous)
              author: true, // Author name
              admin: {
                select: {
                  id: true, // Admin who created the lesson
                },
              },
              tag: {
                select: {
                  id: true, // Tag categorizing this lesson
                },
              },
              order: true, // Display order within course
              // Activities within this lesson (will be deep copied)
              activities: {
                select: {
                  title: true,
                  order: true, // Display order within lesson
                  type: true, // Activity type (video, quiz, reading, etc.)
                  url: true, // Link to activity content
                  author: {
                    select: {
                      id: true, // Author of the activity
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

  // Guard clause: ensure module metadata exists
  if (!existingModuleMetadata)
    throw { status: 404, message: "Module metadata not found" };

  // Create the duplicated module metadata with all nested content
  // This is a single transaction that creates:
  // 1. New ModuleMetadata linked to the original Module
  // 2. New many-to-many relationships for contacts and skills (using provided IDs)
  // 3. New Course records with duplicated data
  // 4. New Lesson records nested within courses
  // 5. New Activity records nested within lessons
  const duplicatedModuleMetadata = await prisma.moduleMetadata.create({
    data: {
      // Copy module metadata properties
      duration: existingModuleMetadata.duration ?? 0,
      // Link to the same base Module (not duplicating the Module itself)
      module: {
        connect: { id: existingModuleMetadata.module.id },
      },
      // Link to the current user's admin record (not the original admin)
      admin: {
        connect: { id: existingAdmin.id },
      },
      // Link to the target parcours
      parcours: {
        connect: { id: parcoursId },
      },
      // Create many-to-many relationships with provided contact IDs
      // Note: Uses provided IDs, not the original module's contacts
      contacts: {
        create: metadatas.contactsIds.map((contactId: number) => ({
          contact: { connect: { id: contactId } },
        })),
      },
      // Create many-to-many relationships with provided bonus skill IDs
      // Note: Uses provided IDs, not the original module's skills
      bonusSkills: {
        create: metadatas.skillsIds.map((skillId: number) => ({
          bonusSkill: { connect: { id: skillId } },
        })),
      },
      // Deep copy all courses and their nested content
      courses: {
        create: existingModuleMetadata.courses.map((course) => ({
          // Copy course properties
          title: course.title,
          description: course.description,
          admin: { connect: { id: existingAdmin.id } }, // Use current admin
          order: course.order,
          author: course.author,
          contacts: {
            create: course.contacts.map((contact) => ({
              contact: { connect: { id: contact.contact.id } },
            })),
          },
          tags: {
            create: course.tags.map((tag) => ({
              tag: { connect: { id: tag.tag.id } },
            })),
          },
          // Deep copy all lessons within the course
          lessons: {
            create: course.lessons.map((lesson) => ({
              // Copy lesson properties
              title: lesson.title,
              description: lesson.description,
              modalite: lesson.modalite,
              order: lesson.order,
              // Link to the same tag (tags are shared, not duplicated)
              tag: {
                connect: { id: lesson.tag.id },
              },
              admin: { connect: { id: existingAdmin.id } }, // Use current admin
              author: lesson.author,
              // Deep copy all activities within the lesson
              activities: {
                create: lesson.activities.map((activity) => ({
                  // Copy activity properties
                  title: activity.title,
                  order: activity.order,
                  type: activity.type,
                  url: activity.url,
                  author: { connect: { id: existingAdmin.id } }, // Use current admin
                })),
              },
            })),
          },
        })),
      },
    },
    select: {
      id: true,
      module: { select: { title: true, thumb: true, description: true } },
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
      bonusSkills: {
        select: { bonusSkill: { select: { id: true, description: true } } },
      },
    },
  });

  // Return the newly created module metadata
  // Note: Could add a select clause here to return specific fields if needed
  return {
    id: duplicatedModuleMetadata.id,
    title: existingModuleMetadata.module.title,
    thumb: existingModuleMetadata.module.image
      ? Buffer.from(existingModuleMetadata.module.image as any).toString(
          "base64"
        )
      : null,
    description: existingModuleMetadata.module.description,
    contacts: duplicatedModuleMetadata.contacts.map((c) => ({
      id: c.contact.id,
      name: c.contact.name,
    })),
    skills: duplicatedModuleMetadata.bonusSkills.map((s) => ({
      id: s.bonusSkill.id,
      description: s.bonusSkill.description,
    })),
  };
}
