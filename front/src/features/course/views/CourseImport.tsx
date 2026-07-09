import { Link } from "react-router";
import Header from "../../../../src/components/headers/Header";
import useImportCourses, {
  CoursesImportStep,
} from "../hooks/useImportCourses";
import ParcoursSelection from "../../../../src/components/import-courses/parcours-selection";
import ImportResult from "../../../../src/components/import-courses/import-result";
import CoursesPreview from "../../../../src/components/import-courses/courses-preview/courses-preview";
import MbzImport from "../../../../src/components/import-courses/mbz-import";

const ImportCoursesHome = () => {
  const {
    step,
    importedCourses,
    error,
    isLoading,
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
    fetchModules,
    handleImportMbz,
    onRemoveActivity,
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
      case CoursesImportStep.MbzImport:
        return (
          <MbzImport
            error={error}
            isLoading={isLoading}
            onImportMbz={handleImportMbz}
          />
        );
      case CoursesImportStep.CoursesPreview:
        return (
          <CoursesPreview
            importedCourses={importedCourses}
            error={error}
            isLoading={isLoading}
            tooltipErrorTip={tooltipErrorTip}
            onImportMbz={handleImportMbz}
            onConfirmZipImport={onConfirmImport}
            onRemoveCourse={onRemoveCourse}
            onToggleLessonSelection={onToggleLessonSelection}
            onUpdateCourseTitle={onUpdateCourseTitle}
            onUpdateLessonTitle={onUpdateLessonTitle}
            onUpdateActivityTitle={onUpdateActivityTitle}
            onRemoveActivity={onRemoveActivity}
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
            onRefreshModules={fetchModules}
          />
        );
      case CoursesImportStep.ImportResult:
        if (!importedCourses) return undefined;
        return (
          <ImportResult
            importedCourses={importedCourses}
            progress={uploadProgress}
            currentAction={currentAction}
            moduleId={selectedModule?.id}
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
        {step !== CoursesImportStep.ImportResult && (
          <Link to={".."} className="btn btn-outline">
            Annuler
          </Link>
        )}
      </Header>
      {renderBody()}
    </div>
  );
};

export default ImportCoursesHome;
