import { title } from "process";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

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
export default async function postDuplicateParcours(parcoursId: number, userId: string) {
 
    const existingParcours = await prisma.parcours.findFirst({
        where: { id: parcoursId },
        select: {
            title: true,
            description: true,
            image: true,
            thumb: true,
            degree: true,
            formationId: true,
            bonusSkills: true,
            objectives: {
                select: {
                    description: true
                }
            },
            contacts: {
                select: {
                    contact: {
                        select: {
                            id: true,
                        }
                    }
                }
            },
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            modules: {
                select: {
                    module: {
                        select: {
                            title: true,
                            description: true,
                            image: true,
                            thumb: true,
                            duration: true,
                            rating: true,
                            author: true,
                            admin: {
                                select: {
                                    id:true
                                }
                            },
                            bonusSkills: {
                                select: {
                                    bonusSkill: {
                                        select: {
                                            id:true
                                        }
                                    }
                                }
                            },
                            contacts: {
                                select: {
                                    contact: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            },
                            courses: {
                                select: {
                                    title: true,
                                    description: true,
                                    image: true,
                                    virtualClass: true,
                                    scenario: true,
                                    order: true,
                                    author:true,
                                    admin: {
                                        select: {
                                            id:true
                                        }
                                    },
                                    bonusSkills: {
                                        select: {
                                            bonusSkill: {
                                                select: {
                                                    id:true
                                                }
                                            }
                                        }
                                    },
                                    contacts: {
                                        select: {
                                            contact: {
                                                select: {
                                                    id: true
                                                }
                                            }
                                        }
                                    },
                                    module: {
                                        select: {
                                            id: true
                                        }
                                    },
                                    objectives: {
                                        select: {
                                            objective: {
                                                select: 
                                                {
                                                    id: true
                                                }
                                            }
                                        }
                                    },
                                    tags: {
                                        select: {
                                            tag: {
                                                select: {
                                                    id: true
                                                }
                                            }
                                        }
                                    },
                                    lessons: {
                                        select: {
                                            title: true,
                                            description: true,
                                            modalite: true,
                                            author: true,
                                            admin: {
                                                select: {
                                                    id: true
                                                }
                                            },
                                            tag: {
                                                select: {
                                                    id: true
                                                }
                                            },
                                            order: true,
                                            activities: {
                                                select: {
                                                    title: true,
                                                    description: true,
                                                    order: true,
                                                    type: true,
                                                    url: true,
                                                    author: {
                                                        select: {
                                                            id: true
                                                        }
                                                    },
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    })

    if (!existingParcours) {
        throw { statusCode: 404, message: "Le parcours n'existe pas." }
    }

    const currentUser = await prisma.admin.findFirst({
        where: { idMdb: userId },
    })

    if (!currentUser) {
        throw { statusCode: 404, message: "L'utilisateur n'existe pas." }
    }
    const mongoUser = await User.findOne({ _id: userId } )
    
    const author = mongoUser ? `${mongoUser.firstname} ${mongoUser.lastname}` : "Utilisateur inconnu"

    const parcours = await prisma.parcours.create({
        data: {
            title: existingParcours.title + " (copie)",
            description: existingParcours.description,
            image: existingParcours.image ? existingParcours.image : null,
            thumb: existingParcours.thumb ? existingParcours.thumb : null,
            degree: existingParcours.degree!,

            admin: {
                connect: {
                    id: currentUser.id
                }
            },

            author,

            objectives: {
                create: existingParcours.objectives.map((objective) => {
                    return {
                        description: objective.description
                    }
                })
            },

            bonusSkills: {
                create: existingParcours.bonusSkills.map((bonusSkill) => {
                    return {
                        description: bonusSkill.description,
                        badge: bonusSkill.badge ? bonusSkill.badge : null
                    }
                })
            },

            formation: {
                connect: {
                    id: existingParcours.formationId
                }
            },

            contacts: {
                create: existingParcours.contacts.map((contact) => {
                    return {
                        contact: {
                            connect: {
                                id: contact.contact.id
                            }
                        }
                    }
                })                
            },

            tags: {
                create: existingParcours. tags.map((tag) => {
                    return {
                        tag: {
                           connect:{id: tag.tag.id}
                       }
                   }
               })
            },

      
            modules: {
                create: existingParcours.modules.map((module) => ({
                    module: {
                        create: {
                            title: module.module.title,
                            description: module.module.description,
                            image: module.module.image ?? undefined,
                            thumb: module.module.thumb ?? undefined,
                            duration: module.module.duration,
                            rating: module.module.rating,
                            author: module.module.author,
                            admin: {
                                connect: {
                                    id: module.module.admin.id
                                }
                            },
                            bonusSkills: {
                                create: module.module.bonusSkills.map(skill => ({
                                    bonusSkill: {
                                        connect: { id: skill.bonusSkill.id }
                                    }
                                }))
                            },
                            contacts: {
                                create: module.module.contacts.map(contact => ({
                                    contact: {
                                        connect: { id: contact.contact.id }
                                    }
                                }))
                            },
                            courses: {
                                create: module.module.courses.map(course => ({
                                    title: course.title,
                                    description: course.description,
                                    image: course.image ?? undefined,
                                    virtualClass: course.virtualClass,
                                    scenario: course.scenario,
                                    order: course.order,
                                    contacts: {
                                        create: course.contacts.map(contact => ({
                                            contact: {
                                                connect: { id: contact.contact.id }
                                            }
                                        }))
                                    },
                                    objectives: {
                                        create: course.objectives.map(objective => ({
                                            objective: {
                                                connect: { id: objective.objective.id }
                                            }
                                        }))
                                    },
                                    bonusSkills: {
                                        create: course.bonusSkills.map(skill => ({
                                            bonusSkill: {
                                                connect: { id: skill.bonusSkill.id }
                                            }
                                        }))
                                    },
                                    author: course.author,
                                    admin: {
                                        connect: {
                                            id: course.admin.id
                                        }
                                    },
                                    lessons: {
                                        create: course.lessons.map(lesson => ({
                                            title: lesson.title,
                                            description: lesson.description,
                                            modalite: lesson.modalite,
                                            author: lesson.author,
                                            admin: {
                                                connect: {
                                                    id: lesson.admin.id
                                                }
                                            },
                                            tag: {
                                                connect: {
                                                    id: lesson.tag.id
                                                }
                                            },
                                            order: lesson.order,
                                            activities: {
                                                create: lesson.activities.map(activity => ({
                                                    title: activity.title,
                                                    description: activity.description,
                                                    order: activity.order,
                                                    type: activity.type,
                                                    url: activity.url,
                                                    author: {
                                                        connect: {
                                                            id: activity.author.id
                                                        }
                                                    }
                                                }))
                                            }
                                        }))
                                    }
                                }))
                            }
                        }
                    }
                }))
            }
        }
    })

    return parcours;
}
    
