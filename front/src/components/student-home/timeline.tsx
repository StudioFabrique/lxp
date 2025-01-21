import { useContext, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import BigCalendarTimeline, {
  Event,
} from "../UI/big-calendar-timeline/big-calendar-timeline";
import { useNavigate } from "react-router-dom";
import { CourseTimeline } from "../../utils/interfaces/course";
import { getRandomDaisyuiBgThemeColor } from "../../utils/get-daisy-ui-theme-color";
import { View, Views } from "react-big-calendar";
import { Context } from "../../store/context.store";
import QuestionMarkTooltip from "../UI/question-mark-tooltip/question-mark-tooltip";

const Timeline = () => {
  const { sendRequest } = useHttp();
  const { roles } = useContext(Context);
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<View>(Views.WORK_WEEK);
  const [showAllCourses, setShowAllCourses] = useState<boolean>(false);

  const [timelineData, setTimelineData] = useState<
    {
      id: number;
      title: string;
      alternateId: number;
      start: Date;
      end: Date;
    }[]
  >();

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

  const [modulesColor, setModulesColor] = useState<
    {
      alternateId: number;
      gradient: string;
    }[]
  >();

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
      // semaine
      setDatesSearchingRange({
        minDate: range[0],
        maxDate: range[range.length - 1],
      });
    } else {
      // mois
      setDatesSearchingRange({
        minDate: range.start,
        maxDate: range.end,
      });
    }
  };

  const handleDoubleClickEvent = (event: Event) => {
    if (event.id && event.alternateId)
      navigate(`/student/parcours/module/${event.alternateId}`, {
        state: { lessonId: event.id },
      });
  };

  useEffect(() => {
    const applyData = (data: { data: CourseTimeline[] }) => {
      const responseData = data.data
        .filter((course) => course.minDate && course.maxDate)
        .map((course) => ({
          id: course.id,
          alternateId: course.moduleId,
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

  // useEffect utilisé pour la génération de couleurs aléatoire
  useEffect(() => {
    // Attribuer une couleur de type gradient à chaque module
    const colors = timelineData?.map((item) => {
      const color = getRandomDaisyuiBgThemeColor();

      return {
        alternateId: item.alternateId,
        gradient: color,
      };
    });
    if (colors) {
      // Retire les doublons
      setModulesColor((prevModules) => {
        const newColors = colors.filter(
          (color) =>
            !prevModules?.some(
              (module) => module.alternateId === color.alternateId,
            ),
        );
        return [...(prevModules || []), ...newColors];
      });
    }
  }, [timelineData]);

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>

      {roles.some((role) => role.rank === 1) && (
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <h3>Afficher tous les cours</h3>
            <QuestionMarkTooltip
              tooltipValue="Les cours affichés par défaut sont ceux affectés à vous en tant qu'équipe pédagogique.
                          Vous avez la possibilité d'afficher tous les cours en tant qu'administrateur."
            />
          </div>
          <div className="flex gap-4">
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Non</span>
              <input
                type="radio"
                name="show-all"
                className="radio radio-primary"
                checked={!showAllCourses}
                onChange={() => setShowAllCourses(false)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-2">Oui</span>
              <input
                type="radio"
                name="show-all"
                className="radio radio-primary"
                checked={showAllCourses}
                onChange={() => setShowAllCourses(true)}
              />
            </label>
          </div>
        </div>
      )}

      <BigCalendarTimeline
        view={currentView}
        onSetView={setCurrentView}
        data={timelineData}
        colors={modulesColor}
        onRangeChange={handleRangeChange}
        onDoubleClickEvent={handleDoubleClickEvent}
      />
    </div>
  ) : (
    <p className="pl-4">Aucune données du calendrier disponible</p>
  );
};

export default Timeline;
