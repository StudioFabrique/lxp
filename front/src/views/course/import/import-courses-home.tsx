import { Link } from "react-router-dom";
import Header from "../../../components/UI/header";
import useImportCourses, {
  CoursesImportStep,
} from "../hooks/use-import-courses";
import ZipImport from "../../../components/import-courses/zip-import/zip-import";
import ParcoursSelection from "../../../components/import-courses/parcours-selection";
import ImportResult from "../../../components/import-courses/import-result";

const ImportCoursesHome = () => {
  const {
    step,
    importedCourses,
    error,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    formationsList,
    selectedFormation,
    parcoursList,
    selectedParcours,
    modulesList,
    selectedModule,
    setSelectedFormation,
    setSelectedParcours,
    setSelectedModule,
    onImportZip,
    onRemoveCourse,
    onToggleLessonSelection,
    onUpdateCourseTitle,
    onUpdateLessonTitle,
    onUpdateActivityTitle,
    onConfirmImport,
    onConfirmParcoursSelection,
    onGoBack,
  } = useImportCourses();

  const renderBody = () => {
    switch (step) {
      case CoursesImportStep.ZipImport:
        return (
          <ZipImport
            importedCourses={importedCourses}
            error={error}
            tooltipErrorTip={tooltipErrorTip}
            onImportZip={onImportZip}
            onConfirmZipImport={onConfirmImport}
            onRemoveCourse={onRemoveCourse}
            onToggleLessonSelection={onToggleLessonSelection}
            onUpdateCourseTitle={onUpdateCourseTitle}
            onUpdateLessonTitle={onUpdateLessonTitle}
            onUpdateActivityTitle={onUpdateActivityTitle}
          />
        );
      case CoursesImportStep.ParcoursSelection:
        return (
          <ParcoursSelection
            formationsList={formationsList}
            selectedFormation={selectedFormation}
            onSelectFormation={setSelectedFormation}
            parcoursList={parcoursList}
            selectedParcours={selectedParcours}
            onSelectParcours={setSelectedParcours}
            modulesList={modulesList}
            selectedModule={selectedModule}
            onSelectModule={setSelectedModule}
            onConfirm={onConfirmParcoursSelection}
            onGoBack={onGoBack}
          />
        );
      case CoursesImportStep.ImportResult:
        if (!importedCourses) return undefined;
        return (
          <ImportResult
            importedCourses={importedCourses}
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
        title="Import de cours"
        description="Importer des cours ainsi que toutes les leçons et activités associées."
      >
        <Link to={".."} className="btn btn-outline">
          Annuler
        </Link>
      </Header>
      {renderBody()}
    </div>
  );
};

export default ImportCoursesHome;
