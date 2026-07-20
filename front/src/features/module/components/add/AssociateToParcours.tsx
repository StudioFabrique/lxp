import { UseFormRegister, FieldErrors } from "react-hook-form";
import Contact from "../../../../utils/interfaces/contact";
import Skill from "../../../../utils/interfaces/skill";
import FormNumberInput from "../../../../components/form/FormNumberInput";
import Selecter from "../../../../components/UI/selecter/selecter.component";
import ModuleToParcours from "./module-to-parcours";
import { Item } from "./useAddModule";

type Props = {
  parcoursId: number | null;
  parcoursList: Item[];
  onPickParcours: (id: number) => void;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  contacts: Contact[] | null;
  currentContacts: Contact[] | null;
  skills: Skill[] | null;
  currentSkills: Skill[] | null;
  isLoading: boolean;
  setCurrentContacts: (contacts: Contact[]) => void;
  setCurrentSkills: (skills: Skill[]) => void;
  onMetadataSubmit: () => void;
  toggleModal: () => void;
  cantSubmit: boolean;
};

export default function AssociateToParcours(props: Props) {
  return (
    <>
      <h2 className="text-sm">
        Choisissez un parcours auquel attacher le module afin de pouvoir mettre
        à jour les compétences et ressources pédagogiques liées
      </h2>
      <Selecter
        defaultItem={{ id: props.parcoursId ?? 0, title: "" }}
        list={props.parcoursList}
        title="Choisissez un parcours auquel attacher le module"
        onSelectItem={props.onPickParcours}
      />
      <FormNumberInput
        label="Durée du module en heures *"
        name="duration"
        placeholder="Ex : 12"
        min={0}
        register={props.register}
        error={props.errors.duration as any}
      />
      <ModuleToParcours
        currentContacts={props.currentContacts ?? []}
        currentSkills={props.currentSkills ?? []}
        contacts={props.contacts ?? []}
        skills={props.skills ?? []}
        isLoading={props.isLoading}
        setCurrentContacts={props.setCurrentContacts}
        setCurrentSkills={props.setCurrentSkills}
        isDisabled={!props.parcoursId}
      />
      <div className="flex justify-end gap-x-4">
        <button
          className="btn btn-outline btn-secondary"
          onClick={props.toggleModal}
        >
          Annuler
        </button>
        <button
          className="btn btn-primary"
          disabled={props.cantSubmit}
          type="button"
          onClick={props.onMetadataSubmit}
        >
          Enregistrer
        </button>
      </div>
    </>
  );
}
