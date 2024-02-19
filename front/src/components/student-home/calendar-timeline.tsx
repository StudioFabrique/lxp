/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import useHttp from "../../hooks/use-http";
import Module from "../../utils/interfaces/module";
import { getRandomHexColor } from "../../utils/randomColor";

type TimelineData =
  | (number | null)[]
  | {
      x: any;
      y: any;
      fill?: ApexFill;
      fillColor?: string;
      strokeColor?: string;
      meta?: any;
      goals?: any;
      barHeightOffset?: number;
      columnWidthOffset?: number;
    }[]
  | [number, number | null][]
  | [number, (number | null)[]][]
  | number[][];

const CalendarTimeline = () => {
  const { sendRequest } = useHttp();

  const [timelineData, setTimelineData] = useState<TimelineData>();

  useEffect(() => {
    const applyData = (data: { data: Module[] }) => {
      setTimelineData(
        data.data
          .filter((module) => module.minDate && module.maxDate)
          .map((module) => {
            return {
              x: module.title,
              y: [
                module.minDate && new Date(module.minDate).getTime(),
                module.maxDate && new Date(module.maxDate).getTime(),
              ],
              fillColor: getRandomHexColor(),
            };
          })
      );
    };

    sendRequest({ path: "/modules/timeline" }, applyData);
  }, [sendRequest]);

  return (
    <div>
      <h2 className="font-bold text-xl">Mon emploi du temps</h2>
      <div className="">
        {timelineData && (
          <ReactApexChart
            type={"rangeBar"}
            height={400}
            series={[
              {
                data: timelineData,
              },
            ]}
            options={{
              plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 5,
                  barHeight: 50,
                },
              },
              xaxis: {
                labels: {
                  format: "MMMM",
                },
                type: "datetime",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarTimeline;
