import { RefObject } from "react";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import Contact from "../../../../../../src.legacy/utils/interfaces/contact";
import Skill from "../../../../../../src.legacy/utils/interfaces/skill";
import CustomError from "../../../../../../src.legacy/utils/interfaces/custom-error";
import FieldNumber from "../../../../../../src.legacy/components/UI/forms/field-number";
import ModuleMetadatas from "../../../../../../src.legacy/components/module-add/module-metadatas";
import ModuleToParcours from "../../../../../../src.legacy/components/module-add/module-to-parcours";

type ModuleFormProps = {
  mode: "create" | "edit";
  refForm: RefObject<HTMLFormElement>;
  data: {
    values: Record<string, unknown>;
    onChangeValue: (field: string, value: unknown) => void;
    errors: CustomError[];
  };
  image: string | null;
  isLoading: boolean;
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
  image,
  refForm,
  data,
  isLoading,
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
      <Wrapper>
        <form onSubmit={onSubmit} ref={refForm}>
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-2">
            <span className="col-span-5">
              <ModuleMetadatas
                data={data}
                thumb={image}
                onSetFile={onSetFile}
                mode={mode}
              >
                <FieldNumber
                  label="Durée du module en heures *"
                  name="duration"
                  placeholder="Ex : 12"
                  min={0}
                  data={data}
                />
              </ModuleMetadatas>
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
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer le module
            </button>
          </div>
        </form>
      </Wrapper>
    </>
  );
}
