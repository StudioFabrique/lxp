/**
 * Utilitaires pour React Big Calendar
 */

/**
 * Obtient la date du lundi le plus récent
 * @returns {Date} Date du lundi le plus récent
 */
const getLatestMonday = (): Date => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const latestMonday = today;
  latestMonday.setDate(today.getDate() - daysSinceMonday);
  return latestMonday;
};

/**
 * Ajuste un tableau de leçons pour correspondre à la semaine en cours
 * @param {Array} lessons - Tableau d'objets leçons avec titre, date de début et de fin
 * @returns {Array} Tableau de leçons avec dates ajustées à la semaine courante
 */
export const adjustScheduleToCurrentWeek = (
  data: { title: string; start: Date; end: Date }[],
): { title: string; start: Date; end: Date }[] => {
  const latestMonday = getLatestMonday();

  return data.map((item) => {
    const lessonDayOfWeek = item.start.getDay();

    // Calcule le nombre de jours depuis lundi (dimanche = 6 jours)
    const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;

    const adjustedStartDate = new Date(latestMonday);

    // Ajuste la date de début au bon jour de la semaine
    adjustedStartDate.setDate(latestMonday.getDate() + daysFromMonday);
    adjustedStartDate.setHours(
      item.start.getHours(),
      item.start.getMinutes(),
      item.start.getSeconds(),
    );
    const adjustedEndDate = new Date(adjustedStartDate);
    adjustedEndDate.setHours(
      item.end.getHours(),
      item.end.getMinutes(),
      item.end.getSeconds(),
    );

    return {
      title: item.title,
      start: adjustedStartDate,
      end: adjustedEndDate,
    };
  });
};
