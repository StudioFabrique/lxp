import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useNavigate } from "react-router-dom";
import { View, Views, Event } from "react-big-calendar";
import { CourseTimeline } from "../../../utils/interfaces/course";

// Interface définissant la structure d'un événement dans la timeline
interface TimelineEvent extends Event {
  id: number;
  title: string;
  alternateId: number;
  firstLessonId: number;
  start: Date;
  end: Date;
}

const useTimeline = (view: View) => {
  const { sendRequest } = useHttp();

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
      new Date().setDate(new Date().getDate() - new Date().getDay() + 1),
    ),
    maxDate: new Date(
      new Date().setDate(new Date().getDate() - new Date().getDay() + 5),
    ),
  });

  // État pour stocker les couleurs associées à chaque module
  // const [modulesColor, setModulesColor] = useState<
  //   {
  //     alternateId: number;
  //     color: string;
  //   }[]
  // >();

  // Gère le changement de plage de dates dans le calendrier
  const handleRangeChange = (
    range:
      | {
          start: Date;
          end: Date;
        }
      | Date[],
  ) => {
    if (Array.isArray(range)) {
      if (currentView === Views.DAY) {
        const date = new Date(range[0]);
        const startOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay() + 1),
        );
        const endOfWeek = new Date(
          date.setDate(date.getDate() - date.getDay() + 5),
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
    if (timelineEvent.id && timelineEvent.alternateId)
      navigate(`/student/parcours/module/${timelineEvent.alternateId}`, {
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
        }));

      setTimelineData(responseData);
    };

    sendRequest(
      {
        path: `/course/timeline?minDate=${datesSearchingRange.minDate}&maxDate=${datesSearchingRange.maxDate}&showAllCourses=${showAllCourses}`,
      },
      applyData,
    );
  }, [sendRequest, datesSearchingRange, showAllCourses]);

  // Effet pour gérer les couleurs des modules
  // useEffect(() => {
  //   const colors = timelineData?.map((item) => {
  //     const color = getRandomDaisyuiBgThemeColor();

  //     return {
  //       alternateId: item.alternateId,
  //       color,
  //     };
  //   });
  //   if (colors) {
  //     setModulesColor((prevModules) => {
  //       const newColors = colors.filter(
  //         (color) =>
  //           !prevModules?.some(
  //             (module) => module.alternateId === color.alternateId,
  //           ),
  //       );
  //       return [...(prevModules || []), ...newColors];
  //     });
  //   }
  // }, [timelineData]);

  return {
    currentView,
    setCurrentView,
    showAllCourses,
    setShowAllCourses,
    timelineData,
    // modulesColor,
    handleRangeChange,
    handleDoubleClickEvent,
  };
};

export default useTimeline;
