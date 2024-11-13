import { useEffect, useState } from "react";
import Module from "../../utils/interfaces/module";
import useHttp from "../../hooks/use-http";
import BigCalendarTimeline from "../UI/big-calendar-timeline/big-calendar-timeline";

const Timeline = () => {
  const { sendRequest } = useHttp();

  const [timelineData, setTimelineData] =
    useState<{ title: string; start: Date; end: Date }[]>();

  useEffect(() => {
    const applyData = (data: { data: Module[] }) => {
      setTimelineData(
        data.data
          .filter((module) => module.minDate && module.maxDate)
          .map((module) => ({
            title: module.title,
            start: new Date(module.minDate!),
            end: new Date(module.maxDate!),
          })),
      );
    };

    sendRequest({ path: "/modules/timeline" }, applyData);
  }, [sendRequest]);

  return timelineData ? (
    <div className="flex flex-col gap-5 bg-primary p-5 rounded-xl">
      <h2 className="text-base-100 font-bold text-xl">Mon emploi du temps</h2>
      <BigCalendarTimeline data={timelineData} />
    </div>
  ) : null;
};

export default Timeline;
