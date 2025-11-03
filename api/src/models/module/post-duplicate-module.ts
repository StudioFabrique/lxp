import { prisma } from "../../utils/db";

export default async function postDuplicateModule(
  originalModuleMetadataId: number,
  metadatas: { contactsIds: number[]; skillsIds: number[] },
  userId: number,
  parcoursId: number
) {
  const existingModuleMetadata = await prisma.moduleMetadata.findFirst({
    where: { id: originalModuleMetadataId },
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

  if (!existingModuleMetadata)
    throw { status: 404, message: "Module metadata not found" };

  const duplicatedModuleMetadata = await prisma.moduleMetadata.create({
    data: {
      ...existingModuleMetadata,
      id: undefined, // Clear the ID to create a new record
      admin: {
        connect: { id: userId },
      },
      contacts: {
        create: metadatas.contactsIds.map((id) => ({ id })),
      },
      bonusSkills: {
        create: existingModuleMetadata.bonusSkills.map((bonusSkill) => {
          return {
            description: bonusSkill.description,
            badge: bonusSkill.badge ? bonusSkill.badge : null,
          };
        }),
      },
      module: {
        create: {
          ...existingModuleMetadata.module,

          id: undefined,
        },
      },
    },
  });
}
