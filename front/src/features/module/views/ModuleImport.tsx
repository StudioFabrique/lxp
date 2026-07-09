import { Link } from "react-router";
import ImportResult from "../../../components/import-modules/import-result";
import ParcoursSelection from "../../../components/import-modules/parcours-selection";
import ZipImport from "../../../components/import-modules/zip-import/zip-import";
import Header from "../../../components/headers/Header";
import useImportModules, {
  ModulesImportStep,
} from "../hooks/useImportModules";

const ImportModulesHome = () => {
  const {
    step,
    importedModules,
    error,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    // Data & Selection states
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    setSelectedFormation,
    setSelectedParcours,
    // Actions
    onImportZip,
    onRemoveModule,
    onUpdateModuleTitle,
    onUpdateCourseTitle,
    onUpdateLessonTitle,
    onUpdateActivityTitle,
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
            tooltipErrorTip={tooltipErrorTip}
            onImportZip={onImportZip}
            onConfirmZipImport={onConfirmImport}
            onRemoveModule={onRemoveModule}
            onUpdateModuleTitle={onUpdateModuleTitle}
            onUpdateCourseTitle={onUpdateCourseTitle}
            onUpdateLessonTitle={onUpdateLessonTitle}
            onUpdateActivityTitle={onUpdateActivityTitle}
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
        if (!importedModules) return undefined;
        return (
          <ImportResult
            importedModules={importedModules}
            error={error}
            progress={uploadProgress}
            currentAction={currentAction}
          />
        );
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
        {step !== ModulesImportStep.ImportResult && (
          <Link to={".."} className="btn btn-outline">
            Annuler
          </Link>
        )}
      </Header>
      {renderBody()}
    </div>
  );
};

export default ImportModulesHome;
