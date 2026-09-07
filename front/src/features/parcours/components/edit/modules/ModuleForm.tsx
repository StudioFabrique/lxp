import { RefObject } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Skill from "../../../../../../src/utils/interfaces/skill";
import ModuleFields from "./ModuleFields";
import ModuleToParcours from "../../../../module/components/add/module-to-parcours";
import FormNumberInput from "../../../../../components/form/FormNumberInput";
import type { ModuleCreateFormValues } from "../../../parcours.schema";

type ModuleFormProps = {
  mode: "create" | "edit";
  refForm: RefObject<HTMLFormElement | null>;
  register: UseFormRegister<ModuleCreateFormValues>;
  errors: FieldErrors<ModuleCreateFormValues>;
  isLoading: boolean;
  isSubmitting: boolean;
  currentContacts: Contact[];
  lockedContactId?: number;
  currentSkills: Skill[];
  contacts: Contact[];
  skills: Skill[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSetFile: (file: File | null) => void;
  setCurrentContacts: (contacts: Contact[]) => void;
  setCurrentSkills: (skills: Skill[]) => void;
};

/**
 * Form component for creating a new module
 * Includes metadata fields and parcours associations
 */
export default function ModuleForm({
  mode,
  refForm,
  register,
  errors,
  isLoading,
  isSubmitting,
  currentContacts,
  lockedContactId,
  currentSkills,
  contacts,
  skills,
  onSubmit,
  onCancel,
  onSetFile,
  setCurrentContacts,
  setCurrentSkills,
}: ModuleFormProps) {
  return (
    <form
      className="mt-6"
      data-onboarding="module-form"
      onSubmit={onSubmit}
      ref={refForm}
      noValidate
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <section className="flex min-w-0 flex-col gap-5">
          <header>
            <h4 className="font-semibold">Informations générales</h4>
            <p className="mt-1 text-sm text-base-content/60">
              Définissez le contenu et la durée estimée du module.
            </p>
          </header>

          <ModuleFields
            mode={mode}
            register={register}
            errors={errors}
            onSetFile={onSetFile}
          >
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
        </section>

        <section
          className="min-w-0 border-t border-base-300 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
          data-recommended-tour="module-assignments"
        >
          <header className="mb-5">
            <h4 className="font-semibold">Affectations</h4>
            <p className="mt-1 text-sm text-base-content/60">
              Associez les ressources pédagogiques et les compétences utiles.
            </p>
          </header>

          <ModuleToParcours
            currentContacts={currentContacts}
            lockedContactIds={
              lockedContactId !== undefined ? [lockedContactId] : []
            }
            currentSkills={currentSkills}
            contacts={contacts}
            skills={skills}
            isLoading={isLoading}
            setCurrentContacts={setCurrentContacts}
            setCurrentSkills={setCurrentSkills}
          />
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
