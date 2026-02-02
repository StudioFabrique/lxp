import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FilePen,
  BookOpen,
  AlertCircle,
  PenLine,
  Check,
} from "lucide-react";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import activityIconType from "../../../utils/activity-icon-type";
import {
  ActivityImport,
  ModuleImport,
} from "../../../views/module/hooks/use-import-modules";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";

type Props = {
  activeModule: ModuleImport | null;
  onSelectActivity: (activity: ActivityImport) => void;
  selectedActivityId?: number;
  onUpdateCourseTitle: (
    moduleId: number,
    courseId: number,
    newTitle: string,
  ) => void;
  onUpdateLessonTitle: (
    moduleId: number,
    courseId: number,
    lessonId: number,
    newTitle: string,
  ) => void;
  onUpdateActivityTitle: (
    moduleId: number,
    courseId: number,
    lessonId: number,
    activityId: number,
    newTitle: string,
  ) => void;
};

const ModuleArborescence = ({
  activeModule,
  onSelectActivity,
  selectedActivityId,
  onUpdateCourseTitle,
  onUpdateLessonTitle,
  onUpdateActivityTitle,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  if (!activeModule) return null;

  if (activeModule.courses.length === 0) {
    return (
      <div className="text-base-content/40 italic text-sm p-4 text-center border border-dashed border-base-300 rounded-lg m-2">
        Ce module ne contient aucun cours.
      </div>
    );
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const saveCourseTitle = (courseId: number) => {
    if (activeModule && activeModule.id && tempTitle.trim() !== "") {
      onUpdateCourseTitle(activeModule.id, courseId, tempTitle);
    }
    setEditingId(null);
  };

  const saveLessonTitle = (courseId: number, lessonId: number) => {
    if (activeModule && activeModule.id && tempTitle.trim() !== "") {
      onUpdateLessonTitle(activeModule.id, courseId, lessonId, tempTitle);
    }
    setEditingId(null);
  };

  const saveActivityTitle = (
    courseId: number,
    lessonId: number,
    activityId: number,
  ) => {
    if (activeModule && activeModule.id && tempTitle.trim() !== "") {
      onUpdateActivityTitle(
        activeModule.id,
        courseId,
        lessonId,
        activityId,
        tempTitle,
      );
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-2 text-sm p-1">
      {activeModule.courses.map(
        (course: Course & { hasError?: boolean }, cIdx) => (
          <details
            key={cIdx}
            open
            className="group/course bg-base-100 rounded-lg border border-base-200 shadow-sm overflow-hidden"
          >
            {/* NIVEAU 1 : COURS */}
            <summary className="cursor-pointer list-none p-2 bg-base-200/50 hover:bg-base-200 font-semibold flex justify-between items-center select-none">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <BookOpen className="w-4 h-4 text-secondary shrink-0" />

                {editingId === `course-${course.id}` ? (
                  <div
                    className="flex items-center gap-1 w-full"
                    onClick={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="input input-xs input-bordered w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCourseTitle(course.id);
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <button
                      className="btn btn-xs btn-square btn-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveCourseTitle(course.id);
                      }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group/edit w-full">
                    <span className="truncate">
                      {toUpperFirstLetter(course.title)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        startEditing(`course-${course.id}`, course.title);
                      }}
                      className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-1 hover:bg-base-300 rounded"
                    >
                      <PenLine className="w-3 h-3 text-base-content/60" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {course.hasError && (
                  <ToolTipWarning
                    tooltipPos="tooltip-left"
                    message="Erreur dans ce cours"
                  />
                )}
                <ChevronDown className="w-4 h-4 group-open/course:block hidden opacity-50" />
                <ChevronRight className="w-4 h-4 group-open/course:hidden block opacity-50" />
              </div>
            </summary>

            {/* NIVEAU 2 : LEÇONS */}
            <div className="pl-4 pr-1 py-1 flex flex-col gap-1">
              {course.lessons.map(
                (lesson: Lesson & { hasError?: boolean }, lIdx) => (
                  <details key={lIdx} open className="group/lesson">
                    <summary className="cursor-pointer list-none p-2 hover:bg-base-100 rounded flex justify-between items-center select-none">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FilePen className="w-3.5 h-3.5 text-base-content/60 shrink-0" />

                        {editingId === `lesson-${lesson.id}` ? (
                          <div
                            className="flex items-center gap-1 w-full"
                            onClick={(e) => e.preventDefault()}
                          >
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              className="input input-xs input-bordered w-full"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && lesson.id)
                                  saveLessonTitle(course.id, lesson.id);
                                e.stopPropagation();
                              }}
                              onClick={(e) => e.stopPropagation()}
                              autoFocus
                            />
                            <button
                              className="btn btn-xs btn-square btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (lesson.id)
                                  saveLessonTitle(course.id, lesson.id);
                              }}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/editLesson w-full">
                            <span className="truncate text-xs font-medium">
                              {toUpperFirstLetter(lesson.title)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                startEditing(
                                  `lesson-${lesson.id}`,
                                  lesson.title,
                                );
                              }}
                              className="opacity-0 group-hover/editLesson:opacity-100 transition-opacity p-1 hover:bg-base-200 rounded"
                            >
                              <PenLine className="w-3 h-3 text-base-content/60" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {lesson.hasError && (
                          <ToolTipWarning
                            tooltipPos="tooltip-left"
                            message="Activités manquantes"
                          />
                        )}
                        <ChevronDown className="w-3 h-3 group-open/lesson:block hidden opacity-40" />
                        <ChevronRight className="w-3 h-3 group-open/lesson:hidden block opacity-40" />
                      </div>
                    </summary>

                    {/* NIVEAU 3 : ACTIVITES */}
                    <div className="pl-4 flex flex-col border-l border-base-200 my-1">
                      {lesson.activities && lesson.activities.length > 0 ? (
                        lesson.activities.map(
                          (
                            activity: Activity & { hasError?: boolean },
                            aIdx,
                          ) => {
                            const isSelected =
                              selectedActivityId === activity.id;
                            const isEditing =
                              editingId === `activity-${activity.id}`;
                            return (
                              <div
                                key={aIdx}
                                className={`flex items-center w-full transition-all border-l-2 pl-2
                                        ${
                                          isSelected
                                            ? `${activity.hasError ? "border-error bg-error/5" : "border-primary bg-primary/5"}`
                                            : "border-transparent hover:bg-base-200/50"
                                        }
                                    `}
                              >
                                {isEditing ? (
                                  <div className="py-1 flex items-center gap-2 w-full">
                                    <span className="shrink-0">
                                      {activityIconType(activity.type)}
                                    </span>
                                    <input
                                      type="text"
                                      value={tempTitle}
                                      onChange={(e) =>
                                        setTempTitle(e.target.value)
                                      }
                                      className="input input-xs input-bordered w-full"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && lesson.id)
                                          saveActivityTitle(
                                            course.id,
                                            lesson.id,
                                            activity.id,
                                          );
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      className="btn btn-xs btn-square btn-success"
                                      onClick={() =>
                                        lesson.id &&
                                        saveActivityTitle(
                                          course.id,
                                          lesson.id,
                                          activity.id,
                                        )
                                      }
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => onSelectActivity(activity)}
                                    className={`text-left py-1.5 text-xs flex items-center gap-2 w-full group/act
                                                    ${isSelected ? "font-semibold" : ""}
                                                    ${activity.hasError ? "text-error" : "text-base-content/70 hover:text-base-content"}
                                                `}
                                  >
                                    <span className="shrink-0">
                                      {activity.hasError ? (
                                        <AlertCircle className="w-3 h-3" />
                                      ) : (
                                        activityIconType(activity.type)
                                      )}
                                    </span>
                                    <span className="truncate flex-1">
                                      {toUpperFirstLetter(activity.title)}
                                    </span>
                                    <div
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (activity.title)
                                          startEditing(
                                            `activity-${activity.id}`,
                                            activity.title,
                                          );
                                      }}
                                      className="opacity-0 group-hover/act:opacity-100 p-1 hover:bg-base-300 rounded cursor-pointer"
                                    >
                                      <PenLine className="w-3 h-3 text-base-content/60" />
                                    </div>
                                  </button>
                                )}
                              </div>
                            );
                          },
                        )
                      ) : (
                        <div className="px-2 py-1 text-xs text-base-content/40 italic flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> vide
                        </div>
                      )}
                    </div>
                  </details>
                ),
              )}
            </div>
          </details>
        ),
      )}
    </div>
  );
};

export default ModuleArborescence;
