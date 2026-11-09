import { useId, useState } from "react";
import { Link } from "react-router";
import { Check, Lock } from "lucide-react";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import { cn } from "../../../../utils/cn";
import { formatNumber } from "../../../../utils/helpers/format-number";
import type { OnboardingStep, OnboardingStepId } from "./build-onboarding-steps";

type Props = {
  steps: OnboardingStep[];
  onCreateFormation: () => void;
  onCreateParcours: () => void;
  /** Passe une étape optionnelle : elle disparaît de la liste. */
  onSkip: (id: OnboardingStepId) => void;
};

type StepAction = {
  label: string;
  to?: string;
  onClick?: () => void;
  action?: "write" | "update";
  object?: "formation" | "parcours";
};

export default function OnboardingChecklist({
  steps,
  onCreateFormation,
  onCreateParcours,
  onSkip,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const listId = useId();
  const requiredSteps = steps.filter((step) => !step.isOptional);
  const doneCount = requiredSteps.filter((step) => step.isDone).length;
  const currentStepId = steps.find((step) => !step.isDone && !step.isLocked)?.id;
  // Repliée, la checklist ne montre que l'étape à faire. Avec une seule étape restante, il n'y a rien à déplier.
  const remainingCount = steps.filter((step) => !step.isDone).length;
  const canCollapse = remainingCount > 1 && currentStepId !== undefined;
  const upcomingCount = remainingCount - 1;
  const visibleSteps =
    canCollapse && !isExpanded
      ? steps.filter((step) => step.id === currentStepId)
      : steps;

  const actionsByStep: Record<OnboardingStep["id"], StepAction[]> = {
    "invite-teacher": [
      {
        label: "Inviter un membre",
        to: "/admin/user/add?roleRank=2&invite=true",
      },
    ],
    "create-formation": [
      {
        label: "Créer ma première formation",
        onClick: onCreateFormation,
        action: "write",
        object: "formation",
      },
    ],
    "create-content": [
      {
        label: "Créer un parcours",
        onClick: onCreateParcours,
        action: "write",
        object: "parcours",
      },
    ],
    "enroll-students": [
      {
        label: "Inviter des apprenants",
        to: "/admin/user/add?roleRank=3&invite=true",
      },
      { label: "Créer un groupe", to: "/admin/group/add" },
    ],
    publish: [{ label: "Voir mes parcours", to: "/admin/parcours" }],
    "add-admin": [
      {
        label: "Ajouter un administrateur",
        to: "/admin/user/add?roleRank=1",
      },
    ],
  };

  return (
    <BoxWrapper className="gap-4 p-5" data-chatbot-target="onboarding-checklist">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-xl font-bold text-primary">Bien démarrer</h3>
          <div className="flex items-center gap-3">
            <p className="text-sm text-base-content/80">
              {formatNumber(doneCount)} étape{doneCount > 1 ? "s" : ""} sur{" "}
              {formatNumber(requiredSteps.length)}
            </p>
            {canCollapse && (
              <button
                type="button"
                className="btn btn-ghost btn-xs text-base-content/80"
                aria-expanded={isExpanded}
                aria-controls={listId}
                aria-label={
                  isExpanded
                    ? "Masquer les étapes suivantes"
                    : `Afficher les ${formatNumber(upcomingCount)} étape${upcomingCount > 1 ? "s" : ""} suivante${upcomingCount > 1 ? "s" : ""}`
                }
                onClick={() => setIsExpanded((current) => !current)}
              >
                {isExpanded ? "Réduire" : "Tout afficher"}
              </button>
            )}
          </div>
        </div>
        <progress
          className="progress progress-primary w-full"
          value={doneCount}
          max={requiredSteps.length}
          aria-label="Progression de la mise en route"
        />
      </div>

      <ol id={listId} className="flex flex-col gap-3">
        {visibleSteps.map((step) => {
          const index = steps.indexOf(step);
          const isCurrent = step.id === currentStepId;
          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex flex-col gap-3 rounded-box border p-4 sm:flex-row sm:items-center",
                isCurrent
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-base-300",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  step.isDone
                    ? "bg-success text-success-content"
                    : isCurrent
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content",
                )}
                aria-hidden="true"
              >
                {step.isDone ? (
                  <Check className="size-4" />
                ) : (
                  formatNumber(index + 1)
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("font-semibold", step.isDone && "line-through")}>
                  {step.title}
                  {step.isOptional && (
                    <span className="badge badge-ghost badge-sm ml-2 align-middle">Optionnelle</span>
                  )}
                  {step.isDone && <span className="sr-only"> (terminée)</span>}
                </p>
                <p className="flex items-start gap-1.5 text-sm text-base-content/80">
                  {step.isLocked && step.lockedReason ? (
                    <>
                      <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      <span>
                        <span className="sr-only">Verrouillée. </span>
                        {step.lockedReason}
                      </span>
                    </>
                  ) : (
                    step.description
                  )}
                </p>
              </div>
              {!step.isDone && (
                <div className="flex flex-wrap gap-2">
                  {actionsByStep[step.id].map((action) => {
                    const isFirstOfCurrentStep =
                      isCurrent && action === actionsByStep[step.id][0];
                    const className = cn(
                      "btn btn-sm",
                      isFirstOfCurrentStep
                        ? "btn-primary"
                        : "btn-outline",
                    );
                    const control = action.to ? (
                      step.isLocked ? (
                        <button type="button" className={className} disabled>
                          {action.label}
                        </button>
                      ) : (
                        <Link
                          to={action.to}
                          className={className}
                          data-chatbot-target={isFirstOfCurrentStep ? "onboarding-current-step" : undefined}
                        >
                          {action.label}
                        </Link>
                      )
                    ) : (
                      <button
                        type="button"
                        className={className}
                        disabled={step.isLocked}
                        data-chatbot-target={isFirstOfCurrentStep ? "onboarding-current-step" : undefined}
                        onClick={action.onClick}
                      >
                        {action.label}
                      </button>
                    );
                    return action.action && action.object ? (
                      <PermissionGuard
                        key={action.label}
                        action={action.action}
                        object={action.object}
                      >
                        {control}
                      </PermissionGuard>
                    ) : (
                      <span key={action.label}>{control}</span>
                    );
                  })}
                  {step.isOptional && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      aria-label={`Passer l'étape : ${step.title}`}
                      onClick={() => onSkip(step.id)}
                    >
                      Passer
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </BoxWrapper>
  );
}
