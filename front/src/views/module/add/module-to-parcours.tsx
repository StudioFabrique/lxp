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
  currentSkills,
  setCurrentContacts,
  setCurrentSkills,
  contacts,
  isLoading,
  skills,
}: Props) {
  /**
   * Fonction qui réinitialise les contacts et les compétences selectionnés
   */
  const handleReset = () => {
    setCurrentContacts([]);
    setCurrentSkills([]);
  };

  return (
    <>
      {/* Composant qui permet de selectionner des contacts */}
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
      >
        {/* Composant qui affiche les compétences selectionnées */}
        <InheritedTextList />
        {/* Composant qui affiche les compétences qui ne sont pas selectionnées */}
        <NotSelectedSkills />
      </InheritedItems>
      {/* Bouton qui permet de réinitialiser les contacts et les compétences selectionnés */}
      <div className="flex justify-end">
        <button
          className="btn btn-secondary"
          disabled={currentContacts.length === 0 && currentSkills.length === 0}
          onClick={handleReset}
        >
          Réinitialiser
        </button>
      </div>
    </>
  );
}
