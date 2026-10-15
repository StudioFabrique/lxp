import { cn } from "../../../../utils/cn";
import Stepper from "../../../../components/UI/stepper-component/stepper-component";
import { useStickyBar } from "../../../../hooks/useStickyBar";
import {
  stickyBarClassName,
  stickySlotClassName,
} from "../../../../components/headers/sticky-bar-styles";
import type Step from "../../../../utils/interfaces/step";

type Props = {
  actualStep: Step;
  stepsList: Step[];
  updateStep: (id: number) => void;
};

// Le bloc qui apparaît attend un peu que l'autre se soit replié : fondu enchaîné, sans à-coup.
const collapseClassName =
  "grid transition-all duration-300 ease-out motion-reduce:transition-none";

/**
 * Étapes de l'édition d'un parcours, qui restent visibles au défilement : collées en haut de la page,
 * elles se réduisent en barre flottante (même effet que les en-têtes de page) avec l'étape courante
 * et un tiret cliquable par étape. Sur mobile, rien ne se colle.
 */
const ParcoursStickyStepper = ({ actualStep, stepsList, updateStep }: Props) => {
  const { isStuck, slotRef, barRef, slotHeight } = useStickyBar();

  return (
    <div
      ref={slotRef}
      data-testid="sticky-stepper"
      data-chatbot-target="parcours-stepper"
      className={stickySlotClassName}
      style={{ height: slotHeight }}
    >
      <div
        ref={barRef}
        data-floating={isStuck}
        className={cn(stickyBarClassName(isStuck), !isStuck && "p-5 md:p-5")}
      >
        {/* Déployé : les étapes, cliquables. Réduit : repliées, hors du focus et des lecteurs d'écran. */}
        <div
          className={cn(
            collapseClassName,
            isStuck ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100 delay-100",
          )}
          inert={isStuck}
        >
          <div className="min-h-0 overflow-hidden">
            <Stepper actualStep={actualStep} stepsList={stepsList} updateStep={updateStep} />
          </div>
        </div>
        {/* Réduit : l'étape courante et la progression. */}
        <div
          className={cn(
            collapseClassName,
            isStuck ? "grid-rows-[1fr] opacity-100 delay-100" : "grid-rows-[0fr] opacity-0",
          )}
          inert={!isStuck}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex items-center gap-3">
              <p className="shrink-0 text-sm font-semibold">
                Étape {actualStep.id} sur {stepsList.length}
                <span className="max-sm:hidden"> : {actualStep.label}</span>
              </p>
              <ol className="flex min-w-0 flex-1 gap-1.5" aria-label="Étapes de l'édition du parcours">
                {stepsList.map((step) => (
                  <li key={step.id} className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="group flex h-5 w-full cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
                      aria-label={`Étape ${step.id} : ${step.label}`}
                      aria-current={step.id === actualStep.id ? "step" : undefined}
                      title={step.label}
                      onClick={() => updateStep(step.id)}
                    >
                      {/* Piste du tiret ; le trait la remplit de gauche à droite en avançant d'étape, et se retire en reculant. */}
                      <span className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20 transition-colors group-hover:bg-info/40">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-0 origin-left rounded-full",
                            "transition-[transform,background-color] duration-500 ease-out motion-reduce:transition-none",
                            step.id <= actualStep.id ? "scale-x-100" : "scale-x-0",
                            step.id === actualStep.id ? "bg-info" : "bg-primary",
                          )}
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcoursStickyStepper;
