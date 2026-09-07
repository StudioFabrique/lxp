import { RefObject } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import ModuleFields from "./ModuleFields";
import FormNumberInput from "../../../../../components/form/FormNumberInput";
import TrophyIcon from "../../../../../components/UI/svg/trophy-icon.component";
import type Skill from "../../../../../utils/interfaces/skill";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type ModuleFormProps = {
  refForm: RefObject<HTMLFormElement | null>;
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
  isSubmitting: boolean;
  duplicatedSkills?: Skill[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

/**
 * Form component for creating or editing a module's general information.
 */
export default function ModuleForm({
  refForm,
  register,
  errors,
  isSubmitting,
  duplicatedSkills,
  onSubmit,
  onCancel,
}: ModuleFormProps) {
  return (
    <form
      className="mt-6"
      data-onboarding="module-form"
      onSubmit={onSubmit}
      ref={refForm}
      noValidate
    >
      <div className="mx-auto max-w-3xl">
        <section className="flex min-w-0 flex-col gap-5">
          <header>
            <h4 className="font-semibold">Informations générales</h4>
            <p className="mt-1 text-sm text-base-content/60">
              Définissez le contenu et la durée estimée du module.
            </p>
          </header>

          <ModuleFields register={register} errors={errors}>
            <div data-onboarding="module-duration-field">
              <FormNumberInput
                label="Durée du module en heures *"
                name="duration"
                placeholder="Ex : 12"
                min={0}
                helperText="Saisissez une durée supérieure à 0. Les valeurs décimales sont acceptées."
                register={register}
                error={errors.duration}
              />
            </div>
          </ModuleFields>

          {duplicatedSkills ? (
            <div className="rounded-box border border-base-300 bg-base-200/50 p-4">
              <h4 className="text-sm font-semibold">
                Compétences dupliquées
              </h4>
              <p className="mt-1 text-xs text-base-content/55">
                Ces compétences proviennent du module source et sont affichées
                en lecture seule.
              </p>
              {duplicatedSkills.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {duplicatedSkills.map((skill, index) => (
                    <div
                      key={skill.id ?? `${skill.description}-${index}`}
                      className="tooltip tooltip-top"
                      data-tip={skill.description}
                    >
                      <div className="flex size-11 items-center justify-center rounded-lg bg-secondary/10 p-1.5">
                        {skill.badge ? (
                          <img
                            src={skill.badge}
                            alt=""
                            className="size-full object-contain"
                          />
                        ) : (
                          <span className="size-6 text-primary" aria-hidden="true">
                            <TrophyIcon />
                          </span>
                        )}
                        <span className="sr-only">{skill.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-base-content/55">
                  Aucune compétence du module source n’est disponible dans ce
                  parcours.
                </p>
              )}
            </div>
          ) : null}
        </section>
      </div>

      <footer className="sticky bottom-0 -mx-2 mt-8 flex justify-end gap-3 border-t border-base-300 bg-base-100/95 px-2 pb-1 pt-4 backdrop-blur-sm">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          data-onboarding="module-save"
          type="submit"
          className="btn btn-primary min-w-44"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <span className="loading loading-spinner loading-sm" />
          )}
          {isSubmitting ? "Enregistrement..." : "Enregistrer le module"}
        </button>
      </footer>
    </form>
  );
}
