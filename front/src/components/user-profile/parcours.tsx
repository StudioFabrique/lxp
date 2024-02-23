import ReactApexChart from "react-apexcharts";
import Wrapper from "../UI/wrapper/wrapper.component";

const Parcours = () => {
  const evaluations = [
    {
      id: "zqd4D45Ee",
      subject: "code html",
      note: 15,
      feedback: "très bien",
      coefficient: "2",
    },
    {
      id: "zqd4D45Ee",
      subject: "PHP",
      note: 13,
      feedback: "intéressant",
      coefficient: "4",
    },
    {
      id: "zqd4D45Ee",
      subject: "Javascript",
      note: 13,
      feedback: "très intéressant",
      coefficient: "4",
    },
  ];

  const randomParticipations = Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * (200 - 10 + 1)) + 10
  );

  const randomMotivations = Array.from(
    { length: 12 },
    () => Math.floor(Math.random() * (200 - 10 + 1)) + 10
  );

  const series = [
    {
      name: "Motivation",
      data: randomMotivations,
    },
    {
      name: "Participation",
      data: randomParticipations,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-lg font-semibold">Parcours</h3>
      <Wrapper>
        <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto">
          <div className="flex justify-between w-full rounded-xl h-[5vh] px-10">
            <p className="py-5 self-center">Sujet</p>
            <span className="border-r-2 border-secondary-content" />
            <p className="py-5 self-center">Note</p>
            <span className="border-r-2 border-secondary-content" />
            <p className="py-5 self-center">Feedback</p>
            <span className="border-r-2 border-secondary-content" />
            <p className="py-5 self-center">Coefficient</p>
          </div>
          {evaluations.map((evaluation) => (
            <div className="flex justify-between bg-secondary w-full rounded-xl h-[10vh] px-10 text-secondary-content">
              <p className="py-5">{evaluation.subject}</p>
              <span className="border-r-2 border-secondary-content" />
              <p className="py-5">{evaluation.note}</p>
              <span className="border-r-2 border-secondary-content" />
              <p className="py-5">{evaluation.feedback}</p>
              <span className="border-r-2 border-secondary-content" />
              <p className="py-5">{evaluation.coefficient}</p>
            </div>
          ))}
        </div>
      </Wrapper>
      <h3 className="text-lg font-semibold">Programme d'entrainement</h3>
      <Wrapper>
        <div></div>
      </Wrapper>
      <h3 className="text-lg font-semibold">Graphique d'évaluation</h3>
      <div className="flex justify-center h-full w-full">
        <ReactApexChart
          type="radar"
          width="500"
          series={series}
          options={{
            series: [
              {
                name: "Series 1",
                data: [80, 50, 30, 40, 100, 20],
              },
              {
                name: "Series 2",
                data: [20, 30, 40, 80, 20, 80],
              },
              {
                name: "Series 3",
                data: [44, 76, 78, 13, 43, 10],
              },
            ],
            chart: {
              height: 350,
              type: "radar",
              dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1,
              },
            },
            title: {
              text: "Radar Chart - Multi Series",
            },
            stroke: {
              width: 2,
            },
            fill: {
              opacity: 0.1,
            },
            markers: {
              size: 0,
            },
            xaxis: {
              categories: ["2011", "2012", "2013", "2014", "2015", "2016"],
            },
          }}
        />
      </div>
    </div>
  );
};

export default Parcours;
