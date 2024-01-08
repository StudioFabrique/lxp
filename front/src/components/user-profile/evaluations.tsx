import { CategoryScale, Chart } from "chart.js/auto";
import Wrapper from "../UI/wrapper/wrapper.component";
import { Radar } from "react-chartjs-2";

Chart.register(CategoryScale);

const Evaluations = () => {
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

  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="text-lg font-semibold">Notes et Evaluations</h3>
      <Wrapper>
        <div className="flex flex-col gap-5 max-h-[50vh] overflow-y-auto">
          <div className="flex justify-between w-full rounded-xl h-[5vh] px-10 text-secondary-content">
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
      <div className="flex justify-center h-[50vh] w-full">
        <div className="bg-secondary/50 rounded-3xl">
          <Radar
            data={{
              labels: [
                "Eating",
                "Drinking",
                "Sleeping",
                "Designing",
                "Coding",
                "Cycling",
                "Running",
              ],
              datasets: [
                {
                  label: "My First Dataset",
                  data: [65, 59, 90, 81, 56, 55, 40],
                  fill: true,
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgb(255, 99, 132)",
                  pointBackgroundColor: "rgb(255, 99, 132)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgb(255, 99, 132)",
                },
                {
                  label: "My Second Dataset",
                  data: [28, 48, 40, 19, 96, 27, 100],
                  fill: true,
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgb(54, 162, 235)",
                  pointBackgroundColor: "rgb(54, 162, 235)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgb(54, 162, 235)",
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Evaluations;
