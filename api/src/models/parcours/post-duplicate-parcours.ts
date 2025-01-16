import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

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
            tags: {
                select: {
                    tag: {
                        select: {
                            id: true
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

    const tags = existingParcours.tags.map(tag => tag.tag.id)


    const mongoUser = await User.findOne({ _id: userId } )
    console.log({mongoUser});
    
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
            formation: {
                connect: {
                    id: existingParcours.formationId
                }
            },
            tags: {
                create: tags.map((tag: number) => {
                    return {
                        tag: {
                           connect:{id: tag}
                       }
                   }
               })
            }
        }
    })

    return parcours;
}
    
