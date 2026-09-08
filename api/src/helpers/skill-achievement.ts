import { calculateModuleProgress, countCourseProgress } from "./calculate-module-progress.ts";

// Seul le contenu accessible à l'apprenant participe à l'obtention du badge.
export const skillAchievementSelect = (userId: string) => ({
  id: true,
  description: true,
  badge: true,
  modules: {
    select: {
      module: {
        select: {
          id: true,
          title: true,
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
  T extends { modules?: { module: ModuleProgress & { id: number; title: string } }[] },
>(skill: T) {
  const { modules = [], ...details } = skill;
  const associatedModules = modules.map(({ module }) => ({
    id: module.id,
    title: module.title,
    progress: calculateModuleProgress(module),
    isCompleted: isModuleCompleted(module),
  }));
  const completedModules = associatedModules.filter((module) => module.isCompleted).length;
  return {
    ...details,
    modules: associatedModules,
    completedModules,
    totalModules: associatedModules.length,
    isEarned: associatedModules.length > 0 && completedModules === associatedModules.length,
  };
}
