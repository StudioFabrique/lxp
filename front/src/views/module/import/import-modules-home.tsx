import { Link } from "react-router-dom";
import ImportResult from "../../../components/import-modules/import-result";
import ParcoursSelection from "../../../components/import-modules/parcours-selection";
import ZipImport from "../../../components/import-modules/zip-import/zip-import";
import Header from "../../../components/UI/header";
import useImportModules, {
  ModulesImportStep,
} from "../hooks/use-import-modules";

/**
 * Import de cours.
 * 1. Choisir le repertoire dans lequel un fichier json et des cours (type texte et document) sont présents.
 * 2. Montrer un récapitulatif des modules et des cours.
 * 3. Après que la vérification du format est validée, choisir une formation puis un parcours. Ensuite un clic sur le bouton "choisir le parcours"
 *    permet de passer à l'étape suivante.
 * 4. Créer les modules, cours et leçons puis envoyer de façon progressive les activités au backend (avec une barre de progression).
 */
const ImportModulesHome = () => {
  const { step, importedModules, error, onImportZip, onConfirmImport } =
    useImportModules();

  const renderBody = () => {
    switch (step) {
      case ModulesImportStep.ZipImport:
        // Folder picker input
        // Show imported Modules -> Courses -> Lessons -> Activities
        return (
          <ZipImport
            importedModules={importedModules}
            error={error}
            onImportZip={onImportZip}
            onConfirmZipImport={onConfirmImport}
          />
        );
      // Select the associated parcours and confirm the import
      case ModulesImportStep.ParcoursSelection:
        return <ParcoursSelection />;
      case ModulesImportStep.ImportResult:
        // Send activites to the server, then show the result of the importation
        return <ImportResult />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Header
        title="Import de modules"
        description="Importer des modules ainsi que tous les cours, leçons et activités associés."
      >
        <Link to={".."} className="btn btn-outline">
          Annuler
        </Link>
      </Header>
      {renderBody()}
    </div>
  );
};

export default ImportModulesHome;
