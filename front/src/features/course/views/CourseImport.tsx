import { useMemo } from "react";
import { Link } from "react-router";
import PageHeader from "../../../components/headers/PageHeader";
import useImportCourses, {
  CoursesImportStep,
} from "../hooks/useImportCourses";
import ParcoursSelection from "../components/import/parcours-selection";
import ImportResult from "../components/import/import-result";
import CoursesPreview from "../components/import/courses-preview/courses-preview";
import MbzImport from "../components/import/mbz-import";
import { getCourseImportTourSteps } from "../components/import/course-import-tour-steps";

const ImportCoursesHome = () => {
  const {
    step,
    importedCourses,
    error,
    isLoading,
    tooltipErrorTip,
    uploadProgress,
    currentAction,
    importProgressItems,
    criticalImportError,
    isImporting,
    isImportComplete,
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
    onRetryImport,
    onGoBack,
  } = useImportCourses();

  const tourSteps = useMemo(
    () =>
      getCourseImportTourSteps({
        step,
        hasSelectedFormation: Boolean(selectedFormation),
        hasSelectedParcours: Boolean(selectedParcours),
        isComplete: isImportComplete,
        hasCriticalError: Boolean(criticalImportError),
      }),
    [
      criticalImportError,
      isImportComplete,
      selectedFormation,
      selectedParcours,
      step,
    ],
  );

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
            items={importProgressItems}
            criticalError={criticalImportError}
            isImporting={isImporting}
            isComplete={isImportComplete}
            onRetry={onRetryImport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Import de cours"
        description="Importer des cours ainsi que toutes les leçons et activités associées."
        tourSteps={tourSteps}
      >
        {step !== CoursesImportStep.ImportResult && (
          <Link to={".."} className="btn btn-outline">
            Annuler
          </Link>
        )}
      </PageHeader>
      <div data-course-import-tour="stage">{renderBody()}</div>
    </div>
  );
};

export default ImportCoursesHome;
