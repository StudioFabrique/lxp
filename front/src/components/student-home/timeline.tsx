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

  const fixtures = [
    {
      title: "Introduction au HTML",
      start: new Date(2024, 10, 11, 8, 30),
      end: new Date(2024, 10, 11, 10, 30),
    },
    {
      title: "Les bases du CSS",
      start: new Date(2024, 10, 11, 10, 45),
      end: new Date(2024, 10, 11, 12, 30),
    },
    {
      title: "CSS avancé",
      start: new Date(2024, 10, 11, 13, 30),
      end: new Date(2024, 10, 11, 15, 0),
    },
    {
      title: "Frameworks CSS",
      start: new Date(2024, 10, 11, 15, 15),
      end: new Date(2024, 10, 11, 16, 30),
    },
    {
      title: "Les bases de JavaScript",
      start: new Date(2024, 10, 12, 8, 30),
      end: new Date(2024, 10, 12, 10, 30),
    },
    {
      title: "JavaScript avancé",
      start: new Date(2024, 10, 12, 10, 45),
      end: new Date(2024, 10, 12, 12, 0),
    },
    {
      title: "Fondamentaux de React",
      start: new Date(2024, 10, 12, 13, 30),
      end: new Date(2024, 10, 12, 15, 0),
    },
    {
      title: "Les Hooks React",
      start: new Date(2024, 10, 12, 15, 15),
      end: new Date(2024, 10, 12, 16, 30),
    },
    {
      title: "Les bases de Node.js",
      start: new Date(2024, 10, 13, 8, 30),
      end: new Date(2024, 10, 13, 10, 30),
    },
    {
      title: "Node.js avancé",
      start: new Date(2024, 10, 13, 10, 45),
      end: new Date(2024, 10, 13, 12, 0),
    },
    {
      title: "Fondamentaux de TypeScript",
      start: new Date(2024, 10, 13, 13, 30),
      end: new Date(2024, 10, 13, 15, 0),
    },
    {
      title: "TypeScript avancé",
      start: new Date(2024, 10, 13, 15, 15),
      end: new Date(2024, 10, 13, 16, 30),
    },
    {
      title: "Les bases de MongoDB",
      start: new Date(2024, 10, 14, 8, 30),
      end: new Date(2024, 10, 14, 10, 30),
    },
    {
      title: "MongoDB avancé",
      start: new Date(2024, 10, 14, 10, 45),
      end: new Date(2024, 10, 14, 12, 0),
    },
    {
      title: "Routage avec Express",
      start: new Date(2024, 10, 14, 13, 30),
      end: new Date(2024, 10, 14, 15, 0),
    },
    {
      title: "Middleware Express",
      start: new Date(2024, 10, 14, 15, 15),
      end: new Date(2024, 10, 14, 16, 30),
    },
    {
      title: "Schémas Merise",
      start: new Date(2024, 10, 15, 8, 30),
      end: new Date(2024, 10, 15, 10, 30),
    },
    {
      title: "SQL",
      start: new Date(2024, 10, 15, 10, 45),
      end: new Date(2024, 10, 15, 12, 0),
    },
    {
      title: "Les bases de Docker",
      start: new Date(2024, 10, 15, 13, 30),
      end: new Date(2024, 10, 15, 15, 0),
    },
    {
      title: "Docker Compose",
      start: new Date(2024, 10, 15, 15, 15),
      end: new Date(2024, 10, 15, 16, 30),
    },
  ];

  return timelineData ? (
    <div className="flex flex-col gap-5">
      <h2 className="text-base-content font-bold text-xl">
        Mon emploi du temps
      </h2>
      <BigCalendarTimeline data={fixtures} />
    </div>
  ) : null;
};

export default Timeline;
