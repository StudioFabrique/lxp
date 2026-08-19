/**
 * Calcul de progression pédagogique — définition unique de l'application.
 *
 * Tout pourcentage de progression affiché quelque part passe par ici : détail
 * d'un parcours, sidebar du module, dashboard apprenant, indicateurs
 * administrateur. Le front n'en recalcule aucun.
 *
 * La progression est pondérée par leçon : un cours de vingt leçons pèse dix
 * fois plus qu'un cours de deux. Moyenner les pourcentages de cours donnerait
 * 50 % à un module dont dix-huit leçons sur vingt restent à faire.
 */

type LessonReadLike = { finishedAt?: Date | null };
type LessonLike = { lessonsRead?: LessonReadLike[] | null };
type CourseLike = { lessons?: LessonLike[] | null };
type ModuleLike = { courses?: CourseLike[] | null };

export type ProgressCount = {
  total: number;
  completed: number;
};

/**
 * Une leçon est terminée dès qu'elle porte un `finishedAt`.
 *
 * On ne compte pas les lectures : `lessonsRead` est filtré par apprenant dans
 * les requêtes Prisma, et la contrainte d'unicité `(lessonId, studentId)`
 * garantit au plus une ligne. Compter les éléments du tableau ferait dépasser
 * 100 % sur les données antérieures à cette contrainte.
 */
function isLessonCompleted(lesson: LessonLike): boolean {
  return (lesson.lessonsRead ?? []).some((read) => Boolean(read.finishedAt));
}

export function countLessonProgress(
  lessons: LessonLike[] | null | undefined,
): ProgressCount {
  const list = lessons ?? [];

  return {
    total: list.length,
    completed: list.filter(isLessonCompleted).length,
  };
}

export function countCourseProgress(
  courses: CourseLike[] | null | undefined,
): ProgressCount {
  return (courses ?? []).reduce<ProgressCount>(
    (accumulator, course) => {
      const { total, completed } = countLessonProgress(course.lessons);
      return {
        total: accumulator.total + total,
        completed: accumulator.completed + completed,
      };
    },
    { total: 0, completed: 0 },
  );
}

/** Pourcentage entier. Un ensemble vide vaut 0, jamais NaN. */
export function toProgressPercentage({
  total,
  completed,
}: ProgressCount): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Pourcentage de progression d'un cours.
 * @param course - Le cours incluant lessons -> lessonsRead
 */
export const calculateCourseProgress = (course: CourseLike): number =>
  toProgressPercentage(countLessonProgress(course.lessons));

/**
 * Pourcentage de progression d'un module.
 * @param module - Le module incluant courses -> lessons -> lessonsRead
 */
export const calculateModuleProgress = (module: ModuleLike): number =>
  toProgressPercentage(countCourseProgress(module.courses));
