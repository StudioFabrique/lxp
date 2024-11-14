import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import BigCalendarTimeline from "../UI/big-calendar-timeline/big-calendar-timeline";

interface CourseFormatted {
  title: string;
  moduleTitle: string;
  minDate: string;
  maxDate: string;
}

const Timeline = () => {
  const { sendRequest } = useHttp();

  const [timelineData, setTimelineData] =
    useState<{ title: string; start: Date; end: Date }[]>();

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

  useEffect(() => {
    const applyData = (data: { data: CourseFormatted[] }) => {
      console.log({ data });

      setTimelineData(
        data.data
          .filter((course) => course.minDate && course.maxDate)
          .map((course) => ({
            title: `${course.moduleTitle} - ${course.title}`,
            start: new Date(course.minDate),
            end: new Date(course.maxDate),
          })),
      );
    };

    sendRequest(
      {
        path: `/course/timeline?minDate=${datesSearchingRange.minDate}&maxDate=${datesSearchingRange.maxDate}`,
      },
      applyData,
    );
  }, [sendRequest, datesSearchingRange]);

  // const fixtures = [
  //   {
  //     title: "Introduction au HTML",
  //     start: new Date(2024, 10, 11, 8, 30),
  //     end: new Date(2024, 10, 11, 10, 30),
  //   },
  // ];

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>
      <BigCalendarTimeline
        data={timelineData}
        onRangeChange={handleRangeChange}
      />
    </div>
  ) : null;
};

export default Timeline;
