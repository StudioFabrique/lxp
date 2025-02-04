import Module from "../../../utils/interfaces/module";
import Contacts from "./contacts";
import Objectifs from "./objectifs";
import Tags from "./tags";

// Type pour les props du composant ModuleData
type ModuleDataProps = { moduleData: Module };

// Composant principal qui affiche les données d'un module
const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    {/* Affichage des objectifs/compétences bonus */}
    <Objectifs objectives={moduleData.bonusSkills} />

    {/* Grid à deux colonnes pour les contacts et tags */}
    <div className="grid grid-cols-2 gap-5">
      <Contacts contacts={moduleData.contacts} />
      <Tags tags={moduleData.tags ?? []} />
    </div>
  </>
);

export default ModuleData;
