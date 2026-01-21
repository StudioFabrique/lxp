import { CheckCircle2 } from "lucide-react";
import Header from "../UI/header";

const ParcoursSelection = () => {
  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        disabled
      >
        <CheckCircle2 className="w-5 h-5 text-success" />
      </Header>
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        alternateBgColor
      />
    </div>
  );
};

export default ParcoursSelection;
