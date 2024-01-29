import { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Context } from "../../store/context.store";

interface DonutChartProp {
  labels: string[];
  series: number[];
}

export default function DonutChart({ labels, series }: DonutChartProp) {
  const { theme } = useContext(Context);
  const [color, setColor] = useState(theme === "dark" ? "white" : "black");

  const options = {
    plotOptions: {
      pie: {
        dataLabels: {
          position: "right",
        },
        donut: {
          size: "40%",
        },
        expandOnClick: false,
      },
    },
    stroke: {
      show: false,
    },
    labels: labels,
    legend: {
      show: true,
      position: "bottom", // Position de la légende
      horizontalAlign: "center", // Alignement horizontal de la légende
      verticalAlign: "middle", // Alignement vertical de la légende
      labels: {
        colors: color, // Couleur du texte de la légende
      },
    },
  };

  useEffect(() => {
    setColor(theme === "dark" ? "white" : "black");
  }, [theme]);

  return (
    <div className="donut">
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
  );
}
