import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { TooltipRenderProps } from "react-joyride";

const PageTourTooltip = ({
  backProps,
  index,
  isLastStep,
  primaryProps,
  size,
  skipProps,
  step,
  tooltipProps,
}: TooltipRenderProps) => (
  <section
    {...tooltipProps}
    className="box-border max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content shadow-2xl"
    style={{ width: "min(24rem, calc(100vw - 2rem))" }}
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
          Étape {index + 1} sur {size}
        </p>
        {step.title && <h2 className="text-lg font-bold">{step.title}</h2>}
      </div>
      <button
        type="button"
        className="btn btn-circle btn-ghost btn-xs"
        {...skipProps}
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    <div className="text-sm leading-relaxed text-base-content/75">
      {step.content}
    </div>

    <div className="mt-5 flex items-center justify-between gap-3">
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${index === 0 ? "invisible" : ""}`}
        disabled={index === 0}
        {...backProps}
      >
        <ArrowLeft className="h-4 w-4" />
        Précédent
      </button>
      <button type="button" className="btn btn-primary btn-sm" {...primaryProps}>
        {isLastStep ? "Terminer" : "Suivant"}
        {!isLastStep && <ArrowRight className="h-4 w-4" />}
      </button>
    </div>
  </section>
);

export default PageTourTooltip;
