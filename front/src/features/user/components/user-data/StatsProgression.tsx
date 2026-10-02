import type { IndicatorModuleProgress } from "../../interfaces/indicators";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { StatsProgressionChart } from "./StatsProgressionChart";

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
            <span className="flex font-bold flex-1">
              {formatTitle(module.title)}
            </span>
            <StatsProgressionChart value={module.progress} />
          </div>
        </div>
      ))}
    </>
  );
}

export { StatsProgressionChart } from "./StatsProgressionChart";
