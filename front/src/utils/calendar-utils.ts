/**
 * Utilitaires pour React Big Calendar
 */

interface TimeConfig {
  startTime?: { hours: number; minutes: number };
  endTime?: { hours: number; minutes: number };
  breakStart?: { hours: number; minutes: number };
  breakEnd?: { hours: number; minutes: number };
}

export interface LessonData {
  id: number;
  alternateId?: number;
  firstLessonId: number;
  title: string;
  start: Date;
  end: Date;
  parcoursTitle?: string;
  formationTitle?: string;
}

/**
 * Ajuste un tableau de leçons pour correspondre à la semaine en cours avec des horaires définis
 * @param {Array} data - Tableau d'objets leçons contenant les dates min et max
 * @param {Object} timeConfig - Configuration des horaires (optionnel)
 * @returns {Array} Tableau de leçons avec dates et heures ajustées
 */
export const adjustScheduleToCurrentWeek = (
  data: LessonData[],
  timeConfig?: TimeConfig,
  isMonthView?: boolean,
): LessonData[] => {
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
          if (isMonthView) {
            // Pour la vue mensuelle, on n'affiche qu'un événement par jour
            const dayStart = new Date(currentDate);
            dayStart.setHours(
              config.startTime.hours,
              config.startTime.minutes,
              0,
            );
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(config.endTime.hours, config.endTime.minutes, 0);

            events.push({
              id: item.id,
              alternateId: item.alternateId,
              firstLessonId: item.firstLessonId,
              title: item.title,
              start: dayStart,
              end: dayEnd,
              parcoursTitle: item.parcoursTitle,
              formationTitle: item.formationTitle,
            });
          } else {
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
              id: item.id,
              alternateId: item.alternateId,
              firstLessonId: item.firstLessonId,
              title: item.title,
              start: morningStart,
              end: morningEnd,
              parcoursTitle: item.parcoursTitle,
              formationTitle: item.formationTitle,
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
              id: item.id,
              alternateId: item.alternateId,
              firstLessonId: item.firstLessonId,
              title: item.title,
              start: afternoonStart,
              end: afternoonEnd,
              parcoursTitle: item.parcoursTitle,
              formationTitle: item.formationTitle,
            });
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return events;
    })
    .flat();
};

export const getColorByAlternateId = (
  alternateId: number,
): { bgColor: string; textColor: string } => {
  const colorOrder = [
    { bgColor: "bg-primary", textColor: "text-neutral-content" },
    { bgColor: "bg-secondary", textColor: "text-neutral-content" },
    { bgColor: "bg-accent", textColor: "text-neutral-content" },
    { bgColor: "bg-neutral", textColor: "text-neutral-content" },
    { bgColor: "bg-info", textColor: "text-neutral-content" },
    { bgColor: "bg-success", textColor: "text-neutral-content" },
    { bgColor: "bg-warning", textColor: "text-neutral" },
    { bgColor: "bg-error", textColor: "text-neutral-content" },
    { bgColor: "bg-base-300", textColor: "text-neutral" },
    { bgColor: "bg-neutral-content", textColor: "text-neutral" },
  ];

  // If number > 10, get last digit
  const normalizedNumber =
    alternateId > 10 ? Number(alternateId.toString().slice(-1)) : alternateId;

  // Get array index (subtract 1 since input starts at 1)
  const colorIndex = normalizedNumber === 0 ? 9 : normalizedNumber - 1;

  return colorOrder[colorIndex];
};
