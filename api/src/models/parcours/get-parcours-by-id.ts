import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

/**
 * Récupère les détails d'un parcours par son ID
 * @param parcoursId - L'ID du parcours à récupérer
 * @param userId - L'ID de l'utilisateur qui fait la requête
 * @returns Les détails du parcours avec les relations associées
 */
async function getParcoursById(parcoursId: number, userId: string) {
  // Récupère le parcours avec toutes ses relations (formation, tags, contacts, etc.)
  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId /* , adminId: admin.id */ },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      image: true,
      virtualClass: true,
      isPublished: true,
      visibility: true,
      // Sélectionne les informations de la formation associée
      formation: {
        select: {
          id: true,
          title: true,
          tags: {
            select: {
              tag: { select: { id: true, name: true, color: true } },
            },
          },
          level: true,
        },
      },
      // Sélectionne les tags associés au parcours
      tags: {
        select: { tag: { select: { id: true, name: true, color: true } } },
      },
      // Sélectionne les contacts associés au parcours
      contacts: {
        select: {
          contact: true,
        },
      },
      // Sélectionne les compétences requises et bonus
      skills: { include: { skill: true } },
      bonusSkills: { select: { id: true, description: true, badge: true } },
      objectives: { select: { id: true, description: true } },
      // Sélectionne les modules avec leurs cours et leçons
      modules: {
        select: {
          id: true,
          duration: true,
          minDate: true,
          maxDate: true,
          contacts: { select: { contact: true } },
          bonusSkills: {
            select: {
              bonusSkill: { select: { id: true, description: true } },
            },
          },
          courses: {
            orderBy: { order: "asc" },
            select: {
              lessons: {
                orderBy: { order: "asc" },
                select: {
                  lessonsRead: {
                    where: { student: { idMdb: userId } },
                    select: { id: true, finishedAt: true },
                  },
                },
              },
            },
          },
        },
      },
      // Sélectionne les groupes associés
      groups: {
        select: {
          group: {
            select: {
              id: true,
              idMdb: true,
            },
          },
        },
      },
      // Sélectionne l'administrateur du parcours
      admin: { select: { id: true, idMdb: true } },
    },
  });

  // Si le parcours n'existe pas, lance une erreur
  if (!parcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  let result: any = parcours;
  if (parcours) {
    // Convertit l'image en base64 si elle existe
    if (parcours.image instanceof Buffer) {
      const base64Image = parcours.image.toString("base64");
      result = { ...result, image: base64Image };
    }
    // Convertit les miniatures des modules en base64 si elles existent
    if (parcours.modules) {
      const updatedModules = parcours.modules.map((item: any) => ({
        ...item,
        module: {
          ...item.module,
          thumb: item.module.thumb?.toString("base64") ?? null,
        },
      }));
      result = { ...result, modules: updatedModules };
      // récupère la liste des utilisateurs de chaque groupe afin de faire la somme du nombre d'etudiants présents
      if (parcours.groups.length > 0) {
        const usersCount = await User.count({
          group: { $in: parcours.groups.map((g: any) => g.group.idMdb) },
        });
        result = { ...result, studentCount: usersCount };
        console.log({ usersCount });
      }
      return result;
    }
    return parcours;
  }
}

export default getParcoursById;
