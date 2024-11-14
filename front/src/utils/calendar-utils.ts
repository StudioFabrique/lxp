/**
 * Utilitaires pour React Big Calendar
 */

interface TimeConfig {
  startTime?: { hours: number; minutes: number };
  endTime?: { hours: number; minutes: number };
  breakStart?: { hours: number; minutes: number };
  breakEnd?: { hours: number; minutes: number };
}

interface LessonData {
  title: string;
  start: Date;
  end: Date;
}

/**
 * Ajuste un tableau de leçons pour correspondre à la semaine en cours avec des horaires définis
 * @param {Array} data - Tableau d'objets leçons contenant les dates min et max
 * @param {Object} timeConfig - Configuration des horaires (optionnel)
 * @returns {Array} Tableau de leçons avec dates et heures ajustées
 */
export const adjustScheduleToCurrentWeek = (
  data: LessonData[],
  timeConfig: TimeConfig = {},
): { title: string; start: Date; end: Date }[] => {
  const defaultConfig = {
    startTime: { hours: 8, minutes: 30 },
    endTime: { hours: 16, minutes: 30 },
    breakStart: { hours: 12, minutes: 0 },
    breakEnd: { hours: 13, minutes: 0 },
  };

  const config = { ...defaultConfig, ...timeConfig };

  return data
    .map((item) => {
      const minDate = new Date(item.start);
      const maxDate = new Date(item.end);

      // Créer les plages horaires pour chaque jour entre minDate et maxDate
      const events = [];

      const currentDate = new Date(minDate);
      while (currentDate <= maxDate) {
        // Ne considérer que les jours de semaine (lundi-vendredi)
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          // Période du matin
          const morningStart = new Date(currentDate);
          morningStart.setHours(
            config.startTime.hours,
            config.startTime.minutes,
            0,
          );
          const morningEnd = new Date(currentDate);
          morningEnd.setHours(
            config.breakStart.hours,
            config.breakStart.minutes,
            0,
          );

          events.push({
            title: item.title,
            start: morningStart,
            end: morningEnd,
          });

          // Période de l'après-midi
          const afternoonStart = new Date(currentDate);
          afternoonStart.setHours(
            config.breakEnd.hours,
            config.breakEnd.minutes,
            0,
          );
          const afternoonEnd = new Date(currentDate);
          afternoonEnd.setHours(
            config.endTime.hours,
            config.endTime.minutes,
            0,
          );

          events.push({
            title: item.title,
            start: afternoonStart,
            end: afternoonEnd,
          });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return events;
    })
    .flat();
};
