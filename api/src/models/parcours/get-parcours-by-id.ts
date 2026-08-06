import { type Contact } from "@prisma/client";
import { calculateModuleProgress } from "../../helpers/calculate-module-progress.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

/**
 * Récupère les détails d'un parcours par son ID
 */
async function getParcoursById(parcoursId: number, userId: string) {
  // 1. Récupération des données brutes
  const parcours = await prisma.parcours.findFirst({
    where: { id: parcoursId },
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
      tags: {
        select: { tag: { select: { id: true, name: true, color: true } } },
      },
      contacts: {
        select: {
          contact: true,
        },
      },
      skills: { include: { skill: true } },
      bonusSkills: { select: { id: true, description: true, badge: true } },
      objectives: { select: { id: true, description: true } },
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
          title: true,
          description: true,
          quizInstructions: true,
          thumb: true,
        },
      },
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
      admin: { select: { id: true, idMdb: true } },
    },
  });

  // 2. Gestion d'erreur (Guard Clause)
  if (!parcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  // 3. Initialisation de l'objet résultat
  // On utilise 'any' ici pour pouvoir modifier les types (Buffer -> string) et ajouter des propriétés
  let result: any = { ...parcours };

  // 4. Traitement de l'image principale
  result.image = parcours.image
    ? Buffer.from(parcours.image as any).toString("base64")
    : null;

  // 5. Traitement des contacts (aplatissement)
  // Transforme [{ contact: {...} }] en [{...}]
  result.contacts = parcours.contacts.map((c) => c.contact);
  result.tags = parcours.tags.map((item) => item.tag);

  // 6. Traitement des modules (si présents)
  if (parcours.modules && parcours.modules.length > 0) {
    result.modules = parcours.modules.map((item: any) => {
      // Image du module
      const thumb = item.thumb
        ? Buffer.from(item.thumb as any).toString("base64")
        : null;

      // Contacts du module (aplatissement)
      const moduleContacts = item.contacts.map((c: any) => c.contact);

      return {
        ...item,
        thumb,
        // Calcul de la progression via la fonction helper
        stats: {
          progress: calculateModuleProgress(item),
        },
        contacts: moduleContacts,
      };
    });
  }

  // 7. Calcul du nombre d'étudiants
  if (parcours.groups && parcours.groups.length > 0) {
    const usersCount = await User.count({
      group: { $in: parcours.groups.map((g: any) => g.group.idMdb) },
    });
    result.studentCount = usersCount;
  }

  // 8. Retour unique
  return result;
}

export default getParcoursById;
