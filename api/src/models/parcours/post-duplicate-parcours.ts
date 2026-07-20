import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";
import { getDuplicateIdentity } from "../../helpers/duplication";
import { duplicateActivityFile } from "../../helpers/duplicate-activity-file";

/**
 * Duplicates an existing learning path (parcours) with all its associated data.
 * Creates a copy of the parcours with all its related modules, courses, lessons, and relationships.
 *
 * @param parcoursId - The ID of the learning path to duplicate
 * @param userId - The ID of the user performing the duplication
 *
 * @throws {Object} 404 error if:
 * - The source parcours doesn't exist
 * - The user performing the action doesn't exist
 *
 * @returns {Promise<Parcours>} The newly created parcours object
 *
 * @remarks
 * The duplication process includes:
 * - Basic parcours information (title, description, image, etc.)
 * - Objectives
 * - Bonus skills
 * - Formation connection
 * - Contact relationships
 * - Tag relationships
 * - Modules with their:
 *   - Courses
 *   - Lessons
 *   - Bonus skills
 *   - Contacts
 *   - Tags
 *   - Objectives
 *
 * The title of the duplicated parcours will be the original title with " (copie)" appended.
 * The author will be set to the current user's full name or "Utilisateur inconnu" if not found.
 */
export default async function postDuplicateParcours(
  parcoursId: number,
  userId: string
) {
  // Fetch the existing parcours with all its relationships
  const existingParcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
    select: {
      // Select basic parcours information
      title: true,
      duplicationIndex: true,
      description: true,
      image: true,
      thumb: true,
      degree: true,
      formationId: true,
      bonusSkills: true,
      // Select objectives with their descriptions
      objectives: {
        select: {
          description: true,
        },
      },
      // Select associated contacts
      contacts: {
        select: {
          contact: {
            select: {
              id: true,
            },
          },
        },
      },
      // Select associated tags
      tags: {
        select: {
          tag: {
            select: {
              id: true,
            },
          },
        },
      },
      // Select all modules and their nested relationships
      modules: {
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
              duplicationIndex: true,
              quizInstructions: true,
              author: true,
              adminId: true,
              formations: { select: { formationId: true } },
            },
          },
          // Courses within modules
          courses: {
            select: {
              // Course basic information
              title: true,
              duplicationIndex: true,
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
                  duplicationIndex: true,
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
                      duplicationIndex: true,
                      order: true,
                      type: true,
                      url: true,
                      author: {
                        select: {
                          id: true,
                        },
                      },
                      resourceActivities: true,
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

  // Check if the parcours exists
  if (!existingParcours) {
    throw { statusCode: 404, message: "Le parcours n'existe pas." };
  }

  // Find the current user in the database
  const currentUser = await prisma.admin.findFirst({
    where: { idMdb: userId },
  });

  // Check if the user exists
  if (!currentUser) {
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
  }

  // Get user details from MongoDB
  const mongoUser = await User.findOne({ _id: userId });

  // Set the author name
  const author = mongoUser
    ? `${mongoUser.firstname} ${mongoUser.lastname}`
    : "Utilisateur inconnu";

  const parcoursTitles = await prisma.parcours.findMany({ select: { title: true } });
  const parcoursIdentity = getDuplicateIdentity(
    existingParcours,
    parcoursTitles.map(({ title }) => title),
  );

  const copiedModules = await Promise.all(
    existingParcours.modules.map(async (metadata) => ({
      ...metadata,
      courses: await Promise.all(metadata.courses.map(async (course) => ({
        ...course,
        title: `${course.title} ${course.duplicationIndex + 1}`,
        duplicationIndex: course.duplicationIndex + 1,
        lessons: await Promise.all(course.lessons.map(async (lesson) => ({
          ...lesson,
          title: `${lesson.title} ${lesson.duplicationIndex + 1}`,
          duplicationIndex: lesson.duplicationIndex + 1,
          activities: await Promise.all(lesson.activities.map(async (activity) => ({
            ...activity,
            title: `${activity.title ?? "Sans titre"} ${activity.duplicationIndex + 1}`,
            duplicationIndex: activity.duplicationIndex + 1,
            url: await duplicateActivityFile(activity.url, activity.type),
            resourceActivities: await Promise.all(activity.resourceActivities.map(async (resource) => ({
              ...resource,
              url: await duplicateActivityFile(resource.url, "resource"),
            }))),
          }))),
        }))),
      }))),
    })),
  );

  // Create the new parcours with all its relationships
  const parcours = await prisma.parcours.create({
    data: {
      // Basic parcours information
      title: parcoursIdentity.title,
      duplicationIndex: parcoursIdentity.duplicationIndex,
      description: existingParcours.description,
      image: existingParcours.image ? existingParcours.image : null,
      thumb: existingParcours.thumb ? existingParcours.thumb : null,
      degree: existingParcours.degree!,

      // Connect to admin
      admin: {
        connect: {
          id: currentUser.id,
        },
      },

      author,

      // Create objectives
      objectives: {
        create: existingParcours.objectives.map((objective) => {
          return {
            description: objective.description,
          };
        }),
      },

      // Create bonus skills
      bonusSkills: {
        create: existingParcours.bonusSkills.map((bonusSkill) => {
          return {
            description: bonusSkill.description,
            badge: bonusSkill.badge ? bonusSkill.badge : null,
          };
        }),
      },

      // Connect to formation
      formation: {
        connect: {
          id: existingParcours.formationId,
        },
      },

      // Create contact relationships
      contacts: {
        create: existingParcours.contacts.map((contact) => {
          return {
            contact: {
              connect: {
                id: contact.contact.id,
              },
            },
          };
        }),
      },

      // Create tag relationships
      tags: {
        create: existingParcours.tags.map((tag) => {
          return {
            tag: {
              connect: { id: tag.tag.id },
            },
          };
        }),
      },

      // Create modules with all their nested relationships
      modules: {
        create: copiedModules.map((module) => ({
          duration: module.duration,
          rating: module.rating,
          admin: {
            connect: {
              id: module.admin.id,
            },
          },
          module: {
            create: {
              title: `${module.module.title} ${module.module.duplicationIndex + 1}`,
              duplicationIndex: module.module.duplicationIndex + 1,
              description: module.module.description,
              image: module.module.image,
              thumb: module.module.thumb,
              quizInstructions: module.module.quizInstructions,
              author: module.module.author,
              adminId: module.module.adminId,
              formations: { create: module.module.formations.map(({ formationId }) => ({ formationId })) },
            },
          },
          // Module relationships
          bonusSkills: {
            create: module.bonusSkills.map((skill) => ({
              bonusSkill: {
                connect: { id: skill.bonusSkill.id },
              },
            })),
          },
          contacts: {
            create: module.contacts.map((contact) => ({
              contact: {
                connect: { id: contact.contact.id },
              },
            })),
          },
          // Create courses within modules
          courses: {
            create: module.courses.map((course) => ({
              title: course.title,
              duplicationIndex: course.duplicationIndex,
              description: course.description,
              image: course.image ?? undefined,
              virtualClass: course.virtualClass,
              scenario: course.scenario,
              order: course.order,
              // Course relationships
              contacts: {
                create: course.contacts.map((contact) => ({
                  contact: {
                    connect: { id: contact.contact.id },
                  },
                })),
              },

              author: course.author,
              admin: {
                connect: {
                  id: course.admin.id,
                },
              },
              // Create lessons within courses
              lessons: {
                create: course.lessons.map((lesson) => ({
                  title: lesson.title,
                  duplicationIndex: lesson.duplicationIndex,
                  description: lesson.description,
                  modalite: lesson.modalite,
                  author: lesson.author,
                  admin: {
                    connect: {
                      id: lesson.admin.id,
                    },
                  },
                  tag: {
                    connect: {
                      id: lesson.tag.id,
                    },
                  },
                  order: lesson.order,
                  // Create activities within lessons
                  activities: {
                    create: lesson.activities.map((activity) => ({
                      title: activity.title,
                      duplicationIndex: activity.duplicationIndex,
                      order: activity.order,
                      type: activity.type,
                      url: activity.url,
                      author: {
                        connect: {
                          id: activity.author.id,
                        },
                      },
                      resourceActivities: {
                        create: activity.resourceActivities.map(({ label, order, url }) => ({ label, order, url })),
                      },
                    })),
                  },
                })),
              },
            })),
          },
        })),
      },
    },
  });

  return parcours;
}
