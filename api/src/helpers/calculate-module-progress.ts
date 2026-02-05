/**
 * Calcule le pourcentage de progression d'un module basé sur les leçons lues.
 * @param module - L'objet module incluant courses -> lessons -> lessonsRead
 * @returns Le pourcentage de progression (ex: 50 pour 50%)
 */
export const calculateModuleProgress = (module: any): number => {
  let totalLessons = 0;
  let completedLessons = 0;

  if (module.courses && module.courses.length > 0) {
    module.courses.forEach((course: any) => {
      if (course.lessons && course.lessons.length > 0) {
        course.lessons.forEach((lesson: any) => {
          totalLessons++;

          // Vérifie si la leçon a été marquée comme terminée
          // On suppose que lessonsRead est filtré par utilisateur via la requête Prisma
          if (
            lesson.lessonsRead &&
            lesson.lessonsRead.length > 0 &&
            lesson.lessonsRead[0].finishedAt
          ) {
            completedLessons++;
          }
        });
      }
    });
  }

  // Évite la division par zéro
  if (totalLessons === 0) return 0;

  return Math.round((completedLessons / totalLessons) * 100);
};
