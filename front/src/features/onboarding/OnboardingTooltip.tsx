import { ArrowLeft, ArrowRight, MousePointerClick, X } from "lucide-react";
import type { TooltipRenderProps } from "react-joyride";

export type OnboardingTooltipData = {
  current: number;
  total: number;
  waitingForAction?: boolean;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  onStop: () => void;
};

const OnboardingTooltip = ({ step, tooltipProps }: TooltipRenderProps) => {
  const data = step.data as OnboardingTooltipData;

  return (
    <section
      {...tooltipProps}
      className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content shadow-2xl"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
            Étape {data.current} sur {data.total}
          </p>
          {step.title && <h2 className="text-lg font-bold">{step.title}</h2>}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          onClick={data.onStop}
          aria-label="Arrêter le tutoriel"
          title="Arrêter le tutoriel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="text-sm leading-relaxed text-base-content/75">
        {step.content}
      </div>

      {data.waitingForAction && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-xs font-medium text-primary">
          <MousePointerClick className="h-4 w-4 shrink-0" />
          Effectuez l’action mise en évidence pour continuer.
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${data.onBack ? "" : "invisible"}`}
          onClick={data.onBack}
          disabled={!data.onBack}
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </button>
        {data.onNext && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={data.onNext}
          >
            {data.nextLabel ?? "Suivant"}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </section>
  );
};

export default OnboardingTooltip;
