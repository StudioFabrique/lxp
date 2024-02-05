import { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Context } from "../../store/context.store";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface VerticalChartsProps {
  categories: string[];
  series: Array<{ name: string; data: any[] }>;
  label: string;
  type: any;
  grid?: boolean;
  width?: string;
  height?: string;
}

export default function VerticalBars({
  categories,
  series,
  label,
  type,
  grid = false,
  width = "450px",
  height = "300px",
}: VerticalChartsProps) {
  // Tronquer les noms de catégories trop longs
  const truncatedCategories = categories.map((category) =>
    category.length > 10 ? category.slice(0, 10) + "..." : category
  );

  const { theme } = useContext(Context);
  const [color, setColor] = useState(theme === "dark" ? "white" : "black");

  const options = {
    chart: {
      id: label,
    },
    xaxis: {
      categories: truncatedCategories,
      labels: {
        // Style des étiquettes des catégories
        style: {
          colors: color,
        },
      },
    },
    yaxis: {
      labels: {
        // Style des étiquettes de l'axe des ordonnées
        style: {
          colors: [color], // Couleur des étiquettes de l'axe des ordonnées
        },
      },
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: 200,
              color: "#FFA500", // Orange
            },
          ],
        },
      },
    },
    grid: { show: grid },
  };

  useEffect(() => {
    setColor(theme === "dark" ? "white" : "black");
  }, [theme]);

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type={type}
            width={width}
            height={height}
          />
        </div>
      </div>
    </div>
  );
}
