import { RefObject } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModuleMetadatas from "../../../views/module/add/module-metadatas";
import ModuleToParcours from "../../../views/module/add/module-to-parcours";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import CustomError from "../../../utils/interfaces/custom-error";

type ModuleFormProps = {
  mode: "create" | "edit";
  refForm: RefObject<HTMLFormElement>;
  data: {
    values: Record<string, string>;
    onChangeValue: (field: string, value: string) => void;
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
                image={}
                onSetFile={onSetFile}
                mode={mode}
              />
            </span>

            <div className="col-span-1 lg:col-span-0 divider sm:my-auto lg:hidden" />
            <div className="col-span-1 divider divider-horizontal lg:mx-auto hidden lg:divider " />

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
