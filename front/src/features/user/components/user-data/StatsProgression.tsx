import type { IndicatorModuleProgress } from "../../interfaces/indicators";

type Props = {
  modules: IndicatorModuleProgress[];
};

/**
 * Avancement module par module.
 *
 * La vignette du module n'est plus affichée : elle obligeait l'endpoint
 * d'indicateurs à transporter une image en base64 par module, pour une
 * information purement décorative.
 */
export default function StatsProgression({ modules }: Props) {
  return (
    <>
      {modules.map((module) => (
        <div
          key={module.id}
          className="flex flex-col md:flex-row md:justify-between overflow-auto pr-2"
        >
          <div className="flex gap-x-4 items-center w-full mb-2">
            <span className="flex capitalize font-bold flex-1">
              {module.title}
            </span>
            <StatsProgressionChart value={module.progress} />
          </div>
        </div>
      ))}
    </>
  );
}

export function StatsProgressionChart(props: { value: number }) {
  return (
    <span className="flex gap-x-2 items-center w-full">
      <progress
        className="progress progress-primary w-96"
        value={props.value}
        max="100"
      ></progress>
      <p className="w-12 text-primary font-semibold">{props.value}%</p>
    </span>
  );
}
