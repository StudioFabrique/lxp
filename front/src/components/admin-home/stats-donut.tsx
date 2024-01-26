import DonutChart from "../UI/donut-chart";

const leconsJavaScript = [
  "Introduction à JavaScript",
  "Variables et types de données",
  "Opérateurs et expressions",
  "Structures de contrôle (if, else, switch)",
  "Boucles (for, while, do-while)" /* 
  "Fonctions en JavaScript",
  "Tableaux et objets",
  "Manipulation du DOM",
  "Événements et gestion d'événements",
  "AJAX et requêtes asynchrones", */,
];

const series = Array.from(
  { length: 5 },
  () => Math.floor(Math.random() * (200 - 10 + 1)) + 10
);

export default function StatsDonut() {
  return (
    <div className="h-full flex flex-col justify-start items-center gap-y-8">
      <h2 className="text-xs font-bold">
        Badges attribués (par nombre d'apprenants)
      </h2>
      <DonutChart series={series} labels={leconsJavaScript} />
    </div>
  );
}
