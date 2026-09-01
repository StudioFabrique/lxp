import { RefObject } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
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
    <>
      <div className="divider text-primary text-xs">
        {mode === "create" ? "Création d'un" : "Édition du"} module
      </div>
      <div data-onboarding="module-form">
        <Wrapper>
          <form onSubmit={onSubmit} ref={refForm} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-2">
              <span className="col-span-5">
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
              </span>

              <div className="mx-auto divider divider-vertical lg:divider-horizontal" />

              <span className="col-span-5">
                <ModuleToParcours
                  currentContacts={currentContacts}
                  currentSkills={currentSkills}
                  contacts={contacts}
                  skills={skills}
                  isLoading={isLoading}
                  setCurrentContacts={setCurrentContacts}
                  setCurrentSkills={setCurrentSkills}
                />
              </span>
            </div>
            <div className="flex gap-x-2 justify-end mt-4">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                data-onboarding="module-save"
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                {isSubmitting ? "Enregistrement..." : "Enregistrer le module"}
              </button>
            </div>
          </form>
        </Wrapper>
      </div>
    </>
  );
}
