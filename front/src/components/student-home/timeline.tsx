import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import BigCalendarTimeline, {
  Event,
} from "../UI/big-calendar-timeline/big-calendar-timeline";
import { useNavigate } from "react-router-dom";
import { CourseTimeline } from "../../utils/interfaces/course";
import { getRandomDaisyuiBgThemeColor } from "../../utils/get-daisy-ui-theme-color";

const Timeline = () => {
  const { sendRequest } = useHttp();
  const navigate = useNavigate();

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
      setDatesSearchingRange({
        minDate: range[0],
        maxDate: range[range.length - 1],
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
        path: `/course/timeline?minDate=${datesSearchingRange.minDate}&maxDate=${datesSearchingRange.maxDate}`,
      },
      applyData,
    );
  }, [sendRequest, datesSearchingRange]);

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
      <BigCalendarTimeline
        data={timelineData}
        colors={modulesColor}
        onRangeChange={handleRangeChange}
        onDoubleClickEvent={handleDoubleClickEvent}
      />
    </div>
  ) : null;
};

export default Timeline;
