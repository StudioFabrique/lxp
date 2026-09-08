import Module from "../../../../../src/utils/interfaces/module";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { FileText } from "lucide-react";
import Competences from "./competences";
import Contacts from "./contacts";
import ModuleBadges from "./module-badges";
// import Objectifs from "./objectifs";

// Type pour les props du composant ModuleData
type ModuleDataProps = { moduleData: Module };

// Composant principal qui affiche les données d'un module
const ModuleData = ({ moduleData }: ModuleDataProps) => (
  <>
    <div className="flex w-full flex-col gap-2">
      <ModuleBadges skills={moduleData.bonusSkills} />
      {moduleData.description?.trim() && (
        <BoxWrapper className="w-full">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex gap-2">
              <FileText />
              <h3 className="text-xl font-bold">Description du module</h3>
            </div>
            <p className="whitespace-pre-line text-base-content/80">
              {moduleData.description}
            </p>
          </div>
        </BoxWrapper>
      )}

      <Competences skills={moduleData.bonusSkills} />
      {/* Affichage des objectifs/compétences bonus */}
    </div>

    <Contacts contacts={moduleData.contacts} />
  </>
);

export default ModuleData;
