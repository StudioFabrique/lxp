import { Link } from "react-router-dom";
import ImportResult from "../../../components/import-modules/import-result";
import ParcoursSelection from "../../../components/import-modules/parcours-selection";
import ZipImport from "../../../components/import-modules/zip-import/zip-import";
import Header from "../../../components/UI/header";
import useImportModules, {
  ModulesImportStep,
} from "../hooks/use-import-modules";

const ImportModulesHome = () => {
  const {
    step,
    importedModules,
    error,
    // Data & Selection states
    formationsList,
    selectedFormation,
    setSelectedFormation,
    parcoursList,
    selectedParcours,
    setSelectedParcours,
    // Actions
    onImportZip,
    onConfirmImport,
    onConfirmParcoursSelection,
    onGoBack,
  } = useImportModules();

  const renderBody = () => {
    switch (step) {
      case ModulesImportStep.ZipImport:
        return (
          <ZipImport
            importedModules={importedModules}
            error={error}
            onImportZip={onImportZip}
            onConfirmZipImport={onConfirmImport}
          />
        );
      case ModulesImportStep.ParcoursSelection:
        return (
          <ParcoursSelection
            formations={formationsList}
            selectedFormation={selectedFormation}
            onSelectFormation={setSelectedFormation}
            parcoursList={parcoursList}
            selectedParcours={selectedParcours}
            onSelectParcours={setSelectedParcours}
            onConfirm={onConfirmParcoursSelection}
            onGoBack={onGoBack}
          />
        );
      case ModulesImportStep.ImportResult:
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
