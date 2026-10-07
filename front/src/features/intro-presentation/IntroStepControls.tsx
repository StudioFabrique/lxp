import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  current: number;
  total: number;
  previousLabel: string;
  onPrevious: () => void;
  /** Désactive la flèche du haut, par exemple au tout premier palier. */
  isPreviousDisabled?: boolean;
  /** Absent : la flèche du bas n'est pas affichée (descente par les clics). */
  nextLabel?: string;
  onNext?: () => void;
  isNextDisabled?: boolean;
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Colonne de contrôles à droite de la zone : flèches carrées et numérotation
 * sur deux chiffres, le total en retrait.
 */
const IntroStepControls = ({
  current,
  total,
  previousLabel,
  onPrevious,
  isPreviousDisabled = false,
  nextLabel,
  onNext,
  isNextDisabled = false,
}: Props) => (
  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border border-base-300 bg-base-100 p-1.5 shadow-sm">
    <button
      type="button"
      className="btn btn-square btn-ghost size-10 rounded-xl"
      aria-label={previousLabel}
      disabled={isPreviousDisabled}
      onClick={onPrevious}
    >
      <ChevronUp className="size-5" aria-hidden="true" />
    </button>

    <p
      className="flex flex-col items-center py-1 leading-none"
      aria-label={`${current} sur ${total}`}
    >
      <span
        className="text-xl font-bold tabular-nums text-primary"
        aria-hidden="true"
      >
        {pad(current)}
      </span>
      <span
        className="mt-1 text-xs font-medium tabular-nums text-base-content/60"
        aria-hidden="true"
      >
        /{pad(total)}
      </span>
    </p>

    {onNext ? (
      <button
        type="button"
        className="btn btn-square btn-primary size-10 rounded-xl"
        aria-label={nextLabel}
        disabled={isNextDisabled}
        onClick={onNext}
      >
        <ChevronDown className="size-5" aria-hidden="true" />
      </button>
    ) : null}
  </div>
);

export default IntroStepControls;
