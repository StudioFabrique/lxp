import { useState, useEffect } from "react";
import Header from "../../UI/header";
import MemoizedFileUpload from "../../UI/image-file-upload/image-file-upload";
import PreviewActivitiesFromImport from "./preview-activities-from-import";
import { Eye, BookOpen, PenLine, Check } from "lucide-react";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import SelectableCard from "../../UI/selectable-card";
import { CourseImport } from "../../../views/course/hooks/use-import-courses";
import { ActivityImport } from "../../../views/module/hooks/use-import-modules";
import CourseArborescence from "./course-arborescence";

type Props = {
  importedCourses?: CourseImport[];
  error?: string;
  isLoading?: boolean;
  tooltipErrorTip?: string;
  onImportMbz: (file: File) => void;
  onConfirmZipImport: () => void;
  onRemoveCourse?: (courseTitle: string) => void;
  onToggleLessonSelection: (courseId: number, lessonId: number) => void;
  onUpdateCourseTitle: (courseId: number, newTitle: string) => void;
  onUpdateLessonTitle: (
    courseId: number,
    lessonId: number,
    newTitle: string,
  ) => void;
  onUpdateActivityTitle: (
    courseId: number,
    lessonId: number,
    activityId: number,
    newTitle: string,
  ) => void;
  onRemoveActivity: (
    courseId: number,
    lessonId: number,
    activityId: number,
  ) => void;
};

const CoursesPreview = ({
  importedCourses,
  error,
  isLoading,
  tooltipErrorTip,
  onImportMbz,
  onConfirmZipImport,
  onRemoveCourse,
  onToggleLessonSelection,
  onUpdateCourseTitle,
  onUpdateLessonTitle,
  onUpdateActivityTitle,
  onRemoveActivity,
}: Props) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseImport | null>(
    null,
  );
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityImport | null>(null);

  const [isEditingCourseTitle, setIsEditingCourseTitle] = useState(false);
  const [tempCourseTitle, setTempCourseTitle] = useState("");

  const headerDescription = error
    ? error
    : importedCourses
      ? `${importedCourses.length > 1 ? importedCourses.length + " c" : "C"}ours prêt${importedCourses.length > 1 ? "s" : ""} à être importé${importedCourses.length > 1 ? "s" : ""}`
      : "Sélectionner le contenu pédagogique à importer";

  const handlePreviewCourse = (course: CourseImport) => {
    setSelectedCourse(course);
    setSelectedActivity(null);
    setTempCourseTitle(course.title);
    setIsEditingCourseTitle(false);
  };

  const handleSaveCourseTitle = () => {
    if (selectedCourse && tempCourseTitle.trim() !== "") {
      onUpdateCourseTitle(selectedCourse.id, tempCourseTitle);
      setIsEditingCourseTitle(false);
    }
  };

  useEffect(() => {
    if (importedCourses && importedCourses.length > 0) {
      if (selectedCourse) {
        const updatedCourse = importedCourses.find(
          (c) => c.id === selectedCourse.id,
        );
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
          if (!isEditingCourseTitle) {
            setTempCourseTitle(updatedCourse.title);
          }
        } else {
          setSelectedCourse(importedCourses[0]);
          setTempCourseTitle(importedCourses[0].title);
        }
      } else {
        setSelectedCourse(importedCourses[0]);
        setTempCourseTitle(importedCourses[0].title);
      }
    } else {
      setSelectedCourse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedCourses]);

  return (
    <div className="flex flex-col gap-6 ml-5">
      <Header
        title="Première étape"
        description="Importer le fichier d'import de cours en .mbz"
        disabled
        isSubHeader
      />
      <Header
        title="Seconde étape"
        isSubHeader
        description={headerDescription}
        alternateBgColor
        hasError={Boolean(error)}
      >
        <div className="flex items-center gap-3">
          <MemoizedFileUpload
            buttonLabel="Ajouter un fichier .mbz"
            variant="minimized"
            maxSize={50 * 1024 * 1024} // 100 Mo
            onSetFile={onImportMbz}
            fileType="mbz"
            isLoading={isLoading}
          />

          <button
            className="btn btn-sm btn-success ml-2 mr-2"
            disabled={(!importedCourses && Boolean(error)) || isLoading}
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
        </div>
      </Header>

      {importedCourses && importedCourses.length > 0 && (
        <div className="ml-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {importedCourses.map((course, idx) => {
              const isSelected = selectedCourse?.id === course.id;
              const subtitle = `${course.lessons.filter((l) => l.isSelected).length} / ${course.lessons.length} leçons`;

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
                  actionLabel="Détails"
                  actionIcon={<Eye className="w-4 h-4" />}
                  onDelete={() => {
                    onRemoveCourse?.(course.title);
                  }}
                  deleteTooltip="Retirer de l'import"
                  onEditTitle={(newTitle) =>
                    onUpdateCourseTitle(course.id, newTitle)
                  }
                />
              );
            })}
          </div>

          {selectedCourse && (
            <div className="grid grid-cols-12 gap-6 h-150 bg-base-300 rounded-xl border border-base-200 p-4 mt-2">
              <div className="select-none col-span-4 overflow-y-auto border-r border-secondary/20 pr-4 custom-scrollbar">
                <div className="flex items-center gap-2 mb-3 min-h-8">
                  <h3 className="text-sm capitalize tracking-wide text-primary font-bold whitespace-nowrap">
                    Cours :
                  </h3>
                  {isEditingCourseTitle ? (
                    <div className="flex items-center gap-1 w-full">
                      <input
                        type="text"
                        value={tempCourseTitle}
                        onChange={(e) => setTempCourseTitle(e.target.value)}
                        className="input input-xs input-bordered w-full"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSaveCourseTitle()
                        }
                        autoFocus
                      />
                      <button
                        className="btn btn-xs btn-square btn-success"
                        onClick={handleSaveCourseTitle}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 w-full group">
                      <span className="truncate text-sm font-bold capitalize">
                        {selectedCourse.title}
                      </span>
                      <button
                        onClick={() => setIsEditingCourseTitle(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-base-200 rounded"
                      >
                        <PenLine className="w-3 h-3 text-base-content/60" />
                      </button>
                    </div>
                  )}
                </div>
                <CourseArborescence
                  activeCourse={selectedCourse}
                  onSelectActivity={setSelectedActivity}
                  selectedActivityId={selectedActivity?.id}
                  onToggleLessonSelection={onToggleLessonSelection}
                  onUpdateLessonTitle={onUpdateLessonTitle}
                  onUpdateActivityTitle={onUpdateActivityTitle}
                  onRemoveActivity={onRemoveActivity}
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
        title="Dernière étape"
        description="Sélectionner le parcours auquels les cours seront rattachés"
        disabled
        isSubHeader
      />
    </div>
  );
};

export default CoursesPreview;
