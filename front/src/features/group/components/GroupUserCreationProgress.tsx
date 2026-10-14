import { UsersRound } from "lucide-react";
import { useId, type ReactNode } from "react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { getGroupUserCreationContext } from "../helpers/group-user-creation-context";
import { cn } from "../../../utils/cn";

type GroupUserCreationProgressProps = { returnTo: string; action?: ReactNode };

export default function GroupUserCreationProgress({ returnTo, action }: GroupUserCreationProgressProps) {
  const titleId = useId();
  const context = getGroupUserCreationContext(returnTo);
  const steps = ["Informations du groupe", "Créer l’apprenant", context.isEditing ? "Enregistrer le groupe" : "Finaliser le groupe"];
  if (!context.safeReturnTo) return null;

  return (
    <section aria-labelledby={titleId} className={cn("grid items-stretch gap-4", Boolean(action) && "@min-[56rem]:grid-cols-[minmax(0,1fr)_20rem]")}>
      <BoxWrapper className="min-h-28 justify-between gap-4 border-primary/30 bg-primary/5 p-5 shadow-none">
          <div className="flex min-w-0 items-start gap-3">
            <UsersRound className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-base-content/70">
                {context.isEditing ? "Modification du groupe en cours" : "Création du groupe en cours"}
              </p>
              <h2 id={titleId} className="mt-1 break-words text-base font-semibold">
                {context.name} <span className="font-normal text-base-content/65">({context.studentCount} {context.studentCount > 1 ? "apprenants" : "apprenant"})</span>
              </h2>
            </div>
          </div>
          <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label="Suivi du groupe">
            {steps.map((step, index) => (
              <li key={step} className={cn("flex items-center gap-2", index === 1 ? "font-semibold text-primary" : "text-base-content/65")} aria-current={index === 1 ? "step" : undefined}>
                <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-xs", index === 1 ? "bg-primary text-primary-content" : "bg-base-300 text-base-content")}>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
      </BoxWrapper>
      {action ? (
        <BoxWrapper className="min-h-28 justify-center border-primary/30 bg-primary/5 p-5 shadow-none">
          {action}
        </BoxWrapper>
      ) : null}
    </section>
  );
}
