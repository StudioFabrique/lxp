import { UseFormRegister, FieldErrors } from "react-hook-form";
import Selecter from "../../../../components/UI/selecter/selecter.component";
import ModuleFields from "../../../../features/parcours/components/edit/modules/ModuleFields";
import { Item } from "./useAddModule";
import Contact from "../../../../utils/interfaces/contact";
import Skill from "../../../../utils/interfaces/skill";
import FormNumberInput from "../../../../components/form/FormNumberInput";
import ModuleToParcours from "./module-to-parcours";

type Props = {
  formationId: number | null;
  formationList: Item[];
  parcoursId: number | null;
  parcoursList: Item[];
  register: UseFormRegister<any>;
  errors: FieldErrors;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPickFormation: (id: number) => void;
  onPickParcours: (id: number) => void;
  onSetFile: (file: File | null) => void;
  setImageBase64: (base64: string | null) => void;
  toggleModal: () => void;
  contacts: Contact[] | null;
  currentContacts: Contact[];
  skills: Skill[] | null;
  currentSkills: Skill[];
  isLoading: boolean;
  setCurrentContacts: (contacts: Contact[]) => void;
  setCurrentSkills: (skills: Skill[]) => void;
};

export default function ModuleCreateForm(props: Props) {
  return (
    <>
      <h2 className="text-sm font-bold">
        Choisissez une formation à laquelle attacher le module
      </h2>
      <Selecter
        defaultItem={{ id: props.formationId ?? 0, title: "" }}
        list={props.formationList}
        title="Choisissez une formation"
        onSelectItem={props.onPickFormation}
        size="md"
      />
      <h2 className="mt-4 text-sm font-bold">
        Choisissez le parcours auquel le module appartient
      </h2>
      <Selecter
        key={props.formationId ?? "no-formation"}
        defaultItem={{ id: props.parcoursId ?? 0, title: "" }}
        list={props.parcoursList}
        title={
          props.formationId
            ? "Choisissez un parcours"
            : "Sélectionnez d’abord une formation"
        }
        onSelectItem={props.onPickParcours}
        size="md"
      />

      <form onSubmit={props.onSubmit} ref={null}>
        <ModuleFields
          register={props.register}
          errors={props.errors}
          onSetFile={props.onSetFile}
          onSetImageBase64={props.setImageBase64}
        />
        <FormNumberInput
          label="Durée du module en heures *"
          name="duration"
          placeholder="Ex : 12"
          min={1}
          register={props.register}
          error={props.errors.duration as any}
        />
        <div className="mt-6">
          <ModuleToParcours
            currentContacts={props.currentContacts}
            currentSkills={props.currentSkills}
            contacts={props.contacts ?? []}
            skills={props.skills ?? []}
            isLoading={props.isLoading}
            setCurrentContacts={props.setCurrentContacts}
            setCurrentSkills={props.setCurrentSkills}
            isDisabled={!props.parcoursId}
          />
        </div>
        <div className="flex justify-end">
          <span className="flex items-center gap-x-4 mt-4">
            <button
              className="btn btn-outline btn-secondary"
              type="button"
              onClick={props.toggleModal}
            >
              Annuler
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={props.isLoading || !props.parcoursId}
            >
              Enregistrer
            </button>
          </span>
        </div>
      </form>
    </>
  );
}
