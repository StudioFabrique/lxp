import Contact from "../../utils/interfaces/contact";
import CustomError from "../../utils/interfaces/custom-error";
import Skill from "../../utils/interfaces/skill";
import ModuleToParcours from "../../views/module/add/module-to-parcours";
import { Item } from "../../views/module/add/useAddModule";
import FieldNumber from "../UI/forms/field-number";
import Selecter from "../UI/selecter/selecter.component";

type Props = {
  parcoursId: number | null;
  parcoursList: Item[];
  onPickParcours: (id: number) => void;
  data: {
    values: Record<string, unknown>;
    onChangeValue: (field: string, value: unknown) => void;
    errors: CustomError[];
  };
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
      <FieldNumber
        label="Durée du module en heures *"
        name="duration"
        placeholder="Ex : 12"
        min={0}
        data={props.data}
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
