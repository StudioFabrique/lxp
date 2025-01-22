import InheritedItems from "../../../components/inherited-items/inherited-items";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import InheritedTextList from "../../../components/inherited-items/inherited-text-list";
import NotSelectedContacts from "../../../components/inherited-items/not-selected-contacts";
import NotSelectedSkills from "./not-selected-skills";

type Props = {
  contacts: Contact[];
  isLoading: boolean;
  skills: Skill[];
  currentContacts: Contact[];
  currentSkills: Skill[];
  setCurrentContacts: (contacts: Contact[]) => void;
  setCurrentSkills: (skills: Skill[]) => void;
};

export default function ModuleToParcours({
  currentContacts,
  currentSkills,
  setCurrentContacts,
  setCurrentSkills,
  contacts,
  isLoading,
  skills,
}: Props) {
  return (
    <>
      <InheritedItems
        drawerId="add-contacts"
        drawerTitle="Ajouter des Contacts"
        title="Ressources Pédagogiques"
        loading={isLoading}
        initialList={contacts}
        selectedItems={currentContacts}
        property="name"
        onSubmit={setCurrentContacts}
      >
        <InheritedTextList additionalProperty="role" />
        <NotSelectedContacts />
      </InheritedItems>
      <InheritedItems
        drawerId="add-skills"
        drawerTitle="Ajouter des Compétences"
        title="Compétences"
        loading={isLoading}
        initialList={skills}
        selectedItems={currentSkills}
        property="description"
        onSubmit={setCurrentSkills}
      >
        <InheritedTextList />
        <NotSelectedSkills />
      </InheritedItems>
      <div className="flex justify-end">
        <button
          className="btn btn-secondary"
          disabled={currentContacts.length === 0 && currentSkills.length === 0}
          onClick={() => {}}
        >
          Réinitialiser
        </button>
      </div>
    </>
  );
}
