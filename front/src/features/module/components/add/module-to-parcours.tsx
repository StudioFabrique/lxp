import Contact from "../../../../utils/interfaces/contact";
import Skill from "../../../../utils/interfaces/skill";
import InheritedItems from "../../../../components/shared/inherited-items/inherited-items";
import InheritedTextList from "../../../../components/shared/inherited-items/inherited-text-list";
import NotSelectedContacts from "../../../../components/shared/inherited-items/not-selected-contacts";
import NotSelectedSkills from "./not-selected-skills";
import { CircleQuestionMark } from "lucide-react";

type Props = {
  contacts: Contact[];
  isLoading: boolean;
  skills: Skill[];
  currentContacts: Contact[];
  lockedContactIds?: number[];
  currentSkills: Skill[];
  setCurrentContacts: (contacts: Contact[]) => void;
  setCurrentSkills: (skills: Skill[]) => void;
  isDisabled?: boolean;
};

/**
 * Composant qui permet de selectionner des contacts et des compétences pour
 * les ajouter à un module.
 *
 * @param {object} props - Les propriétés du composant
 * @param {Contact[]} props.currentContacts - Les contacts actuellement selectionnés
 * @param {Skill[]} props.currentSkills - Les compétences actuellement selectionnées
 * @param {function} props.setCurrentContacts - La fonction pour mettre à jour les contacts selectionnés
 * @param {function} props.setCurrentSkills - La fonction pour mettre à jour les compétences selectionnées
 * @param {Contact[]} props.contacts - La liste des contacts
 * @param {boolean} props.isLoading - Un booléen qui indique si une requête est en cours
 * @param {Skill[]} props.skills - La liste des compétences
 */
export default function ModuleToParcours({
  currentContacts,
  lockedContactIds = [],
  currentSkills,
  setCurrentContacts,
  setCurrentSkills,
  contacts,
  isLoading,
  skills,
  isDisabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-y-8">
      {/* Composant qui permet de selectionner des contacts */}
      <InheritedItems
        capitalize
        drawerId="add-contacts"
        drawerTitle="Ajouter des Ressources Pédagogiques"
        title="Ressources Pédagogiques"
        loading={isLoading}
        initialList={contacts}
        selectedItems={currentContacts}
        lockedItemIds={lockedContactIds}
        property={["firstname", "lastname"]}
        onSubmit={setCurrentContacts}
        titleSize="medium"
        isDisabled={isDisabled}
      >
        {/* Composant qui affiche les contacts selectionnés */}
        <InheritedTextList additionalProperty="role" />
        {/* Composant qui affiche les contacts qui ne sont pas selectionnés */}
        <NotSelectedContacts />
      </InheritedItems>

      {/* Composant qui permet de selectionner des compétences */}
      <InheritedItems
        drawerId="add-skills"
        drawerTitle="Ajouter des Compétences"
        title="Compétences"
        loading={isLoading}
        initialList={skills}
        selectedItems={currentSkills}
        property="description"
        onSubmit={setCurrentSkills}
        titleSize="medium"
        isDisabled={isDisabled}
      >
        {/* Composant qui affiche les compétences selectionnées */}
        <InheritedTextList />
        {/* Composant qui affiche les compétences qui ne sont pas selectionnées */}
        <NotSelectedSkills />
      </InheritedItems>
      <div className="flex items-start gap-x-2 text-xs text-primary justify-between">
        <CircleQuestionMark className="text-primary" />
        Vous pourrez toujours ajouter ou modifier les ressources pédagogiques et
        les compétences plus tard.
      </div>
    </div>
  );
}
