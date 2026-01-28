import { ModuleImport } from "../../views/module/hooks/use-import-modules";
import Header from "../UI/header";
import Loader from "../UI/loader";

type Props = {
  importedModules: ModuleImport[];
};

const ImportResult = ({ importedModules }: Props) => {
  const parcoursTitle = importedModules[0].parcours.title;

  return (
    <div className="flex flex-col gap-6 ml-5 animate-in fade-in duration-500">
      {/* Header étape 1 */}
      <Header
        title="Première étape"
        description="Téléverser un dossier compressé de format .zip"
        successBgColor
        isSubHeader
        disabled
      />
      {/* Header étape 2 */}
      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les modules seront rattachés"
        successBgColor
        isSubHeader
        disabled
      />
      {/* Header étape 3 (actuelle) */}
      <Header
        title="Traitement de l'importation..."
        description={`Les modules selectionnés sont en cours d'importation${parcoursTitle ? " dans le parcours " + parcoursTitle : ""}. Merci de ne pas quitter ou recharger la page.`}
        alternateBgColor
        isSubHeader
      >
        <Loader />
      </Header>
    </div>
  );
};

export default ImportResult;
