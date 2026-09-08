import { countCourseProgress } from "./calculate-module-progress.ts";

// Seul le contenu accessible à l'apprenant participe à l'obtention du badge.
export const skillAchievementSelect = (userId: string) => ({
  id: true,
  description: true,
  badge: true,
  modules: {
    select: {
      module: {
        select: {
          courses: {
            where: { visibility: true, isPublished: true },
            select: {
              lessons: {
                select: {
                  lessonsRead: {
                    where: { student: { idMdb: userId } },
                    select: { finishedAt: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}) as const;

type ModuleProgress = { courses: Parameters<typeof countCourseProgress>[0] };

export function isModuleCompleted(module: ModuleProgress): boolean {
  const { total, completed } = countCourseProgress(module.courses);
  return total > 0 && completed === total;
}

export function withSkillAchievement<
  T extends { modules?: { module: ModuleProgress }[] },
>(skill: T) {
  const { modules = [], ...details } = skill;
  return {
    ...details,
    isEarned:
      modules.length > 0 &&
      modules.every(({ module }) => isModuleCompleted(module)),
  };
}
