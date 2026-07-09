import {
  ChevronDown,
  ChevronRight,
  FilePen,
  AlertCircle,
  PenLine,
  Check,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import activityIconType from "../../../utils/helpers/activity-icon-type";
import { toUpperFirstLetter } from "../../../utils/helpers/text-helpers";
import Lesson from "../../../../src/utils/interfaces/lesson";
import ToolTipWarning from "../../../components/UI/tooltip-warning/tooltip-warning";
import {
  ActivityImport,
  CourseImport,
} from "../../../features/course/hooks/useImportCourses";

type Props = {
  activeCourse: CourseImport | null;
  onSelectActivity: (activity: ActivityImport) => void;
  selectedActivityId?: number;
  onToggleLessonSelection: (courseId: number, lessonId: number) => void;
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

const CourseArborescence = ({
  activeCourse,
  onSelectActivity,
  selectedActivityId,
  onToggleLessonSelection,
  onUpdateLessonTitle,
  onUpdateActivityTitle,
  onRemoveActivity,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  if (!activeCourse)
    return (
      <div className="text-base-content/40 italic text-sm text-center mt-10">
        Sélectionnez un cours ci-dessus
      </div>
    );

  if (activeCourse.lessons.length === 0) {
    return (
      <div className="text-base-content/40 italic text-sm p-4 text-center border border-dashed border-base-300 rounded-lg m-2">
        Ce cours ne contient aucune leçon.
      </div>
    );
  }

  const startEditing = (id: string, currentTitle: string) => {
    setEditingId(id);
    setTempTitle(currentTitle);
  };

  const saveLessonTitle = (lessonId: number) => {
    if (activeCourse && tempTitle.trim() !== "") {
      onUpdateLessonTitle(activeCourse.id, lessonId, tempTitle);
    }
    setEditingId(null);
  };

  const saveActivityTitle = (lessonId: number, activityId: number) => {
    if (activeCourse && tempTitle.trim() !== "") {
      onUpdateActivityTitle(activeCourse.id, lessonId, activityId, tempTitle);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-3 text-sm p-1">
      {activeCourse.lessons.map(
        (
          lesson: Lesson & { hasError?: boolean; isSelected: boolean },
          lIdx,
        ) => (
          <details
            key={lIdx}
            open
            className={`group bg-base-100 rounded-lg border shadow-sm overflow-hidden transition-all ${!lesson.isSelected ? "opacity-60 border-base-200" : "border-base-200"}`}
          >
            {/* Niveau 1 : La Leçon */}
            <summary
              className={`cursor-pointer list-none p-3 font-semibold transition-colors flex justify-between items-center select-none
                ${lesson.hasError ? "bg-error/10 text-error" : "bg-base-100 hover:bg-base-200 text-base-content"}
              `}
            >
              <div className="flex items-center gap-3 w-full mr-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-primary"
                  checked={lesson.isSelected}
                  onChange={() => {
                    if (lesson.id)
                      onToggleLessonSelection(activeCourse.id, lesson.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FilePen className="w-4 h-4 opacity-70 shrink-0" />
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
                            saveLessonTitle(lesson.id);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                      <button
                        className="btn btn-xs btn-square btn-success"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (lesson.id) saveLessonTitle(lesson.id);
                        }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/edit w-full">
                      <span
                        className={`line-clamp-1 ${!lesson.isSelected && "line-through text-base-content/50"}`}
                      >
                        {toUpperFirstLetter(lesson.title)}
                      </span>
                      {lesson.isSelected && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            startEditing(`lesson-${lesson.id}`, lesson.title);
                          }}
                          className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-1 hover:bg-base-300 rounded"
                        >
                          <PenLine className="w-3 h-3 text-base-content/60" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {lesson.hasError && (
                  <ToolTipWarning
                    tooltipPos="tooltip-left"
                    message="Des activités sont manquantes"
                  />
                )}
                <ChevronDown className="w-4 h-4 group-open:block hidden opacity-50" />
                <ChevronRight className="w-4 h-4 group-open:hidden block opacity-50" />
              </div>
            </summary>

            {/* Niveau 2 : Les Activités */}
            {lesson.isSelected && (
              <div className="flex flex-col border-t border-base-200 bg-base-50/50">
                {lesson.activities && lesson.activities.length > 0 ? (
                  lesson.activities.map((activity: ActivityImport, aIdx) => {
                    const isSelected = selectedActivityId === activity.id;
                    const isEditing = editingId === `activity-${activity.id}`;

                    return (
                      <div
                        key={aIdx}
                        className={`flex items-center w-full border-l-4 transition-all
                            ${
                              isSelected
                                ? `${activity.hasError ? "border-error bg-error/10" : "border-primary bg-primary/10"}`
                                : `border-transparent hover:bg-base-200`
                            }
                          `}
                      >
                        {isEditing ? (
                          <div className="px-4 py-1 flex items-center gap-2 w-full">
                            <span className="shrink-0">
                              {activityIconType(activity.type)}
                            </span>
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              className="input input-xs input-bordered w-full"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && lesson.id)
                                  saveActivityTitle(lesson.id, activity.id);
                              }}
                              autoFocus
                            />
                            <button
                              className="btn btn-xs btn-square btn-success"
                              onClick={() => {
                                if (lesson.id)
                                  saveActivityTitle(lesson.id, activity.id);
                              }}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onSelectActivity(activity)}
                            className={`text-left px-4 py-2 text-xs flex items-center gap-3 w-full group/act
                                ${isSelected ? "font-semibold" : ""}
                                ${activity.hasError ? "text-error" : "text-base-content/70 hover:text-base-content"}
                              `}
                          >
                            <span className="shrink-0">
                              {activity.hasError ? (
                                <AlertCircle className="w-3.5 h-3.5" />
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
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                if (lesson.id) {
                                  onRemoveActivity(
                                    activeCourse.id,
                                    lesson.id,
                                    activity.id,
                                  );
                                }
                              }}
                              className="opacity-0 group-hover/act:opacity-100 p-1 hover:bg-error/20 rounded cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3 text-error/70" />
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-xs text-base-content/40 italic flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Aucune activité dans cette leçon
                  </div>
                )}
              </div>
            )}
          </details>
        ),
      )}
    </div>
  );
};

export default CourseArborescence;
