/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FC, memo } from "react";
import { getLessonsStats } from "../../helpers/stats/lessons-stats";

type Props = {
  stats: any[];
};

const VerticalCharts: FC<Props> = memo(({ stats }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const { labels, values } = getLessonsStats(stats);

  const data = {
    labels,
    datasets: [
      {
        label: labels,
        data: values,
        backgroundColor: "orange",
      },
    ],
  };

  return <Bar options={options} data={data} />;
});

export default VerticalCharts;
