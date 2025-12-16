import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useLocation, useNavigate } from "react-router-dom";
import { CourseTimeline } from "../../../utils/interfaces/course";
import Parcours from "../../../utils/interfaces/parcours";

// Interface définissant la structure d'un événement dans la timeline
interface TimelineEvent extends Event {
  id: number;
  title: string;
  alternateId: number;
  firstLessonId: number;
  start: Date;
  end: Date;
  parcours?: Parcours;
  parcoursTitle?: string;
  formationTitle?: string;
}

const useTimeline = (view: View) => {
  const { sendRequest } = useHttp();
  const { pathname } = useLocation();

  const navigate = useNavigate();

  // États pour gérer la vue et les filtres
  const [currentView, setCurrentView] = useState<View>(view);
  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>();

  // État pour la plage de dates à rechercher (par défaut: semaine courante)
  const [datesSearchingRange, setDatesSearchingRange] = useState<{
    minDate: Date;
    maxDate: Date;
  }>({
    minDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 1)
    ),
    maxDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5)
    ),
  });

  // Gère le changement de plage de dates dans le calendrier
  const handleRangeChange = (
    range:
      | {
          start: Date;
          end: Date;
        }
      | Date[]
  ) => {
    if (Array.isArray(range)) {
      if (currentView === Views.DAY) {
        const date = new Date(range[0]);
        const startOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay() + 1)
        );
        const endOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay() + 5)
        );
        setDatesSearchingRange({
          minDate: startOfWeek,
          maxDate: endOfWeek,
        });
        return;
      }
      setDatesSearchingRange({
        minDate: range[0],
        maxDate: range[range.length - 1],
      });
    } else {
      setDatesSearchingRange({
        minDate: range.start,
        maxDate: range.end,
      });
    }
  };

  // Navigation vers le module lors d'un double-clic sur un événement
  const handleDoubleClickEvent = (event: Event) => {
    const timelineEvent = event as TimelineEvent;
    const route = pathname.split("/")[1];

    if (timelineEvent.id && timelineEvent.alternateId)
      navigate(`/${route}/parcours/module/${timelineEvent.alternateId}`, {
        state: { lessonId: timelineEvent.firstLessonId },
      });
  };

  // Effet pour charger les données de la timeline
  useEffect(() => {
    const applyData = (data: { data: CourseTimeline[] }) => {
      const responseData = data.data
        .filter((course) => course.minDate && course.maxDate)
        .map((course) => ({
          id: course.id,
          alternateId: course.moduleId,
          firstLessonId: course.firstLessonId,
          title: `${course.moduleTitle} - ${course.title}`,
          start: new Date(course.minDate),
          end: new Date(course.maxDate),
          parcoursTitle: course.parcoursTitle,
          formationTitle: course.formationTitle,
        }));

      setTimelineData(responseData);
    };

    sendRequest(
      {
        path: `/course/timeline?minDate=${datesSearchingRange.minDate}&maxDate=${datesSearchingRange.maxDate}&showAllCourses=${showAllCourses}`,
      },
      applyData
    );
  }, [sendRequest, datesSearchingRange, showAllCourses]);

  return {
    currentView,
    setCurrentView,
    showAllCourses,
    setShowAllCourses,
    timelineData,
    handleRangeChange,
    handleDoubleClickEvent,
  };
};

export default useTimeline;
