import { cn } from "../../../utils/cn";

type Props = {
  /** Forme de la section en cours de chargement : modules, historique ou badges. */
  variant: "modules" | "journal" | "badges";
  /** Libellé lu par les lecteurs d'écran. */
  label: string;
  className?: string;
};

const MODULE_COUNT = 3;
const JOURNAL_ROW_COUNT = 3;
const BADGE_COUNT = 3;

/** Squelette d'une section de « Mon avancement » : reprend la forme du contenu pour éviter tout saut à l'arrivée des données. */
export default function ProgressSectionSkeleton({ variant, label, className }: Readonly<Props>) {
  return (
    <div role="status" aria-label={label} className={cn("w-full", className)}>
      <span className="sr-only">{label}…</span>
      {variant === "modules" && (
        <div className="rounded-xl border border-base-300 bg-base-200 p-5" aria-hidden="true">
          <div className="skeleton mb-4 h-5 w-64 max-w-full" />
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: MODULE_COUNT }, (_, index) => (
              <li key={index} className="space-y-3 rounded-lg bg-base-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="skeleton h-5 w-2/3" />
                  <div className="skeleton h-5 w-10" />
                </div>
                <div className="skeleton h-2 w-full" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {variant === "journal" && (
        <ul className="space-y-3" aria-hidden="true">
          {Array.from({ length: JOURNAL_ROW_COUNT }, (_, index) => (
            <li key={index} className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-4">
              <div className="skeleton size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-3/4" />
              </div>
            </li>
          ))}
        </ul>
      )}
      {variant === "badges" && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {Array.from({ length: BADGE_COUNT }, (_, index) => (
            <li key={index} className="flex items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-4">
              <div className="skeleton size-14 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
