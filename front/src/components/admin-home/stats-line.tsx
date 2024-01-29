import VerticalBars from "../UI/vertical-bars";

const monthes = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jui",
  "Juil",
  "Aou",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
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

export default function StatsLine() {
  return (
    <div>
      <h2 className="font-bold">Martin Betatest</h2>
      <VerticalBars
        label="Martin Betatest"
        series={series}
        categories={monthes}
        type="line"
        grid={true}
        width="380px"
        height="250px"
      />
      <h3 className="font-bold text-xs">Progression du parcours</h3>
      <progress
        className="progress progress-accent"
        value={89}
        max="100"
      ></progress>
    </div>
  );
}
