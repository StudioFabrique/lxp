import { MousePointerClick, X } from "lucide-react";
import type { TooltipRenderProps } from "react-joyride";

const OnboardingWelcomeTooltip = ({
  closeProps,
  step,
  tooltipProps,
}: TooltipRenderProps) => (
  <section
    {...tooltipProps}
    aria-describedby="onboarding-welcome-tour-content"
    aria-labelledby="onboarding-welcome-tour-title"
    className="box-border max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-5 text-base-content shadow-2xl"
    style={{ width: "min(22rem, calc(100vw - 2rem))" }}
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary/70">
          Pour bien démarrer
        </p>
        {step.title && (
          <h2 id="onboarding-welcome-tour-title" className="text-lg font-bold">
            {step.title}
          </h2>
        )}
      </div>
      <button
        type="button"
        className="btn btn-circle btn-ghost btn-xs"
        {...closeProps}
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    <div
      id="onboarding-welcome-tour-content"
      className="text-sm leading-relaxed text-base-content/75"
    >
      {step.content}
    </div>

    <p className="mt-4 flex items-center gap-2 rounded-lg bg-primary/10 p-3 text-xs font-medium text-primary">
      <MousePointerClick className="h-4 w-4 shrink-0" />
      Cliquez sur le bouton mis en évidence pour lancer le tutoriel.
    </p>
  </section>
);

export default OnboardingWelcomeTooltip;
