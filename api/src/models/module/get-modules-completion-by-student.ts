import { prisma } from "../../utils/db";
import { calculateModuleProgress } from "../../helpers/calculate-module-progress"; // Assurez-vous que le chemin est bon
import User from "../../utils/interfaces/db/user";

export default async function getModulesCompletionByStudent(
  studentMdbId: string,
) {
  const student = await User.findById(studentMdbId);

  if (!student) return null;

  // 1. On récupère les métadonnées de modules (l'instance du module avec les cours)
  // On filtre pour ne prendre que ceux où l'étudiant a au moins une leçon finie.
  const modulesMetadata = await prisma.moduleMetadata.findMany({
    where: {
      courses: {
        some: {
          lessons: {
            some: {
              lessonsRead: {
                some: {
                  student: { idMdb: student.id },
                  finishedAt: { not: null }, // On cherche uniquement s'il y a une date de fin
                },
              },
            },
          },
        },
      },
    },
    include: {
      // On récupère les infos génériques du module (titre, image)
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          thumb: true,
        },
      },
      // On récupère la structure des cours/leçons pour le calcul
      courses: {
        select: {
          lessons: {
            select: {
              lessonsRead: {
                where: {
                  student: { idMdb: student.id },
                },
                select: {
                  finishedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // 2. On transforme les données et on applique le calcul de progression
  const result = modulesMetadata.map((meta) => {
    // Gestion de l'image (Buffer -> Base64)
    const thumb = meta.module.thumb
      ? Buffer.from(meta.module.thumb).toString("base64")
      : null;

    // Calcul de la progression via votre fonction helper
    // L'objet 'meta' respecte la structure attendue : { courses: [ { lessons: [ { lessonsRead: [...] } ] } ] }
    const progress = calculateModuleProgress(meta);

    return {
      id: meta.module.id, // ID du module générique
      metadataId: meta.id, // ID de l'instance du module (utile pour les liens)
      title: meta.module.title,
      description: meta.module.description,
      thumb: thumb,
      stats: {
        progress: progress,
      },
    };
  });

  return result;
}
