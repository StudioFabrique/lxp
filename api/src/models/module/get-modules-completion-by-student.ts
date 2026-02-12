import { prisma } from "../../utils/db";
import { calculateModuleProgress } from "../../helpers/calculate-module-progress";
import User from "../../utils/interfaces/db/user";

export default async function getModulesCompletionByStudent(
  studentMdbId: string,
) {
  const student = await User.findById(studentMdbId);

  if (!student || !student.group) return null;

  const modulesMetadata = await prisma.moduleMetadata.findMany({
    where: {
      parcours: {
        groups: {
          some: {
            group: {
              idMdb: { in: student.group.id },
            },
          },
        },
      },
    },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          thumb: true,
        },
      },
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

  const result = modulesMetadata.map((meta) => {
    const thumb = meta.module.thumb
      ? Buffer.from(meta.module.thumb).toString("base64")
      : null;

    // Calcul de la progression
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

  const completedModulesSum = result.filter((m) => {
    console.log(m.stats.progress);

    return m.stats.progress === 100;
  }).length;
  const parcoursCompletion =
    result.length > 0 ? (completedModulesSum / result.length) * 100 : 0;

  return { result, parcoursCompletion };
}
