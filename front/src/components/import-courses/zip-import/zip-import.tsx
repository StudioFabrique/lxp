import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import { Eye, BookOpen } from "lucide-react";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import SelectableCard from "../../UI/selectable-card";
import { CourseImportType } from "../../../views/course/hooks/use-import-courses";
import { ActivityImportType } from "../../../views/module/hooks/use-import-modules";
import CourseArborescence from "./course-arborescence";

type Props = {
  importedCourses?: CourseImportType[];
  error?: string;
  tooltipErrorTip?: string;
  onImportZip: (file: File) => void;
  onConfirmZipImport: () => void;
  onRemoveCourse?: (courseTitle: string) => void;
};

const ZipImport = ({
  importedCourses,
  error,
  tooltipErrorTip,
  onImportZip,
  onConfirmZipImport,
  onRemoveCourse,
}: Props) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseImportType | null>(
    null,
  );
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImportType | null>(null);

  const headerDescription = error
    ? error
    : importedCourses
      ? `${importedCourses.length > 1 ? importedCourses.length + " c" : "C"}ours prêt${importedCourses.length > 1 ? "s" : ""} à être importé${importedCourses.length > 1 ? "s" : ""}`
      : "Téléverser un dossier compressé de format .zip";

  const handlePreviewCourse = (course: CourseImportType) => {
    setSelectedCourse(course);
    setSelectedActivity(null);
  };

  useEffect(() => {
    if (importedCourses && importedCourses.length > 0) {
      if (
        !selectedCourse ||
        !importedCourses.find((c) => c.title === selectedCourse.title)
      ) {
        setSelectedCourse(importedCourses[0]);
      }
    } else {
      setSelectedCourse(null);
    }
    setSelectedActivity(null);
  }, [importedCourses, selectedCourse]);

  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        isSubHeader
        description={headerDescription}
        alternateBgColor
        hasError={Boolean(error)}
      >
        <MemoizedFileUpload
          buttonLabel="Importer un fichier .zip"
          variant="minimized"
          maxSize={10000000}
          onSetFile={onImportZip}
          fileType="zip"
        />

        <button
          className="btn btn-sm btn-success hover:text-base-100 ml-5 mr-2"
          disabled={!importedCourses || Boolean(error)}
          onClick={onConfirmZipImport}
        >
          Confirmer l'importation
        </button>
        {tooltipErrorTip && (
          <QuestionMarkTooltip
            tooltipValue={tooltipErrorTip}
            tooltipPosition="left"
          />
        )}
      </Header>

      {importedCourses && importedCourses.length > 0 && (
        <div className="ml-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedCourses.map((course, idx) => {
              const isSelected = selectedCourse?.title === course.title;
              const subtitle = `${course.lessons.length} leçons`;

              return (
                <SelectableCard
                  key={idx}
                  title={toUpperFirstLetter(course.title)}
                  error={
                    course.hasError ? "Des ressources sont manquantes" : ""
                  }
                  subtitle={subtitle}
                  icon={<BookOpen className="w-5 h-5" />}
                  isSelected={isSelected}
                  onAction={() => handlePreviewCourse(course)}
                  actionLabel="Aperçu"
                  actionIcon={<Eye className="w-4 h-4" />}
                  onDelete={() => {
                    onRemoveCourse?.(course.title);
                  }}
                  deleteTooltip="Retirer de l'import"
                />
              );
            })}
          </div>

          {selectedCourse && (
            <div className="grid grid-cols-12 gap-6 h-[600px] bg-base-300 rounded-xl border border-base-200 p-4 mt-2">
              <div className="select-none col-span-4 overflow-y-auto border-r border-secondary/20 pr-4 custom-scrollbar">
                <h3 className="text-xs uppercase tracking-wide text-primary font-bold mb-3">
                  Cours : {selectedCourse.title}
                </h3>
                <CourseArborescence
                  activeCourse={selectedCourse}
                  onSelectActivity={setSelectedActivity}
                  selectedActivityId={selectedActivity?.id}
                />
              </div>

              <div className="col-span-8 overflow-y-auto custom-scrollbar bg-base-100 rounded-lg shadow-sm border border-base-200 h-full">
                <PreviewActivitiesFromImport activity={selectedActivity} />
              </div>
            </div>
          )}
        </div>
      )}

      <Header
        title="Seconde étape"
        description="Selectionner le parcours auquels les cours seront rattachés"
        disabled
        isSubHeader
      />
    </div>
  );
};

export default ZipImport;
