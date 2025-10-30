import Module from "../../../utils/interfaces/module";
import Competences from "./competences";
import Contacts from "./contacts";
import Objectifs from "./objectifs";

// Type pour les props du composant ModuleData
type ModuleDataProps = { moduleData: Module };

// Composant principal qui affiche les données d'un module
const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    <Competences skills={moduleData.bonusSkills} />
    {/* Affichage des objectifs/compétences bonus */}

    <Objectifs
      objectives={moduleData.courses.flatMap((course) =>
        (course.objectives || []).map((obj) => obj)
      )}
    />

    {/* Grid à deux colonnes pour les contacts et tags */}
    <div className="grid grid-cols-2 gap-5">
      <Contacts contacts={moduleData.contacts} />
      {/* <Tags tags={moduleData.tags ?? []} /> */}
    </div>
  </>
);

export default ModuleData;
