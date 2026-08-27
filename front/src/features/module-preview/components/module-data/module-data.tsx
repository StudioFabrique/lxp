import Module from "../../../../../src/utils/interfaces/module";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { FileText } from "lucide-react";
import Competences from "./competences";
import Contacts from "./contacts";
// import Objectifs from "./objectifs";

// Type pour les props du composant ModuleData
type ModuleDataProps = { moduleData: Module };

// Composant principal qui affiche les données d'un module
const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    <div className="flex w-full flex-col gap-2">
      {moduleData.description.trim() && (
        <Wrapper additionalClassname="w-full">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex gap-2">
              <FileText />
              <h3 className="text-xl font-bold">Description du module</h3>
            </div>
            <p className="whitespace-pre-line text-base-content/80">
              {moduleData.description}
            </p>
          </div>
        </Wrapper>
      )}

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
