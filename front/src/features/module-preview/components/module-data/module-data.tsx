import Module from "../../../../../src/utils/interfaces/module";
import Competences from "./competences";
import Contacts from "./contacts";
// import Objectifs from "./objectifs";

// Type pour les props du composant ModuleData
type ModuleDataProps = { moduleData: Module };

// Composant principal qui affiche les données d'un module
const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    <div className="flex gap-2 w-full">
      <Competences skills={moduleData.bonusSkills} />
      {/* Affichage des objectifs/compétences bonus */}

      {/* <Objectifs
        objectives={moduleData.courses.flatMap((course) =>
          (course.objectives || []).map((obj) => obj)
        )}
      /> */}
    </div>

    <Contacts contacts={moduleData.contacts} />
  </>
);

export default ModuleData;
