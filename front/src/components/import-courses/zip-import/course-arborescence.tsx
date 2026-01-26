import { ChevronDown, ChevronRight, FilePen, AlertCircle } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";
import Lesson from "../../../utils/interfaces/lesson";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import {
  ActivityImportType,
  CourseImportType,
} from "../../../views/course/hooks/use-import-courses";

type Props = {
  activeCourse: CourseImportType | null;
  onSelectActivity: (activity: ActivityImportType) => void;
  selectedActivityId?: number;
};

const CourseArborescence = ({
  activeCourse,
  onSelectActivity,
  selectedActivityId,
}: Props) => {
  // Empty State : Aucun cours sélectionné
  if (!activeCourse)
    return (
      <div className="text-base-content/40 italic text-sm text-center mt-10">
        Sélectionnez un cours ci-dessus
      </div>
    );

  // Empty State : Cours vide
  if (activeCourse.lessons.length === 0) {
    return (
      <div className="text-base-content/40 italic text-sm p-4 text-center border border-dashed border-base-300 rounded-lg m-2">
        Ce cours ne contient aucune leçon.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 text-sm p-1">
      {activeCourse.lessons.map(
        (lesson: Lesson & { hasError?: boolean }, lIdx) => (
          <details
            key={lIdx}
            open
            className="group bg-base-100 rounded-lg border border-base-200 shadow-sm overflow-hidden"
          >
            {/* Niveau 1 : La Leçon */}
            <summary
              className={`cursor-pointer list-none p-3 font-semibold transition-colors flex justify-between items-center select-none
                ${lesson.hasError ? "bg-error/10 text-error" : "bg-base-100 hover:bg-base-200 text-base-content"}
              `}
            >
              <div className="flex items-center gap-2">
                <FilePen className="w-4 h-4 opacity-70" />
                <span className="line-clamp-1">
                  {toUpperFirstLetter(lesson.title)}
                </span>
              </div>

              <div className="flex items-center gap-2">
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
            <div className="flex flex-col border-t border-base-200 bg-base-50/50">
              {lesson.activities && lesson.activities.length > 0 ? (
                lesson.activities.map((activity: ActivityImportType, aIdx) => {
                  const isSelected = selectedActivityId === activity.id;
                  return (
                    <button
                      key={aIdx}
                      onClick={() => onSelectActivity(activity)}
                      className={`text-left px-4 py-2 text-xs flex items-center gap-3 transition-all w-full border-l-4
                        ${
                          isSelected
                            ? `${activity.hasError ? "border-error bg-error/10 text-error" : "border-primary bg-primary/10 text-primary"} font-semibold`
                            : `border-transparent hover:bg-base-200 ${activity.hasError ? "text-error hover:text-error-focus" : "text-base-content/70 hover:text-base-content"}`
                        }
                      `}
                    >
                      <span className="shrink-0">
                        {activity.hasError ? (
                          <AlertCircle className="w-3.5 h-3.5" />
                        ) : (
                          activityIconType(activity.type)
                        )}
                      </span>
                      <span className="truncate">
                        {toUpperFirstLetter(activity.title)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-xs text-base-content/40 italic flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" />
                  Aucune activité dans cette leçon
                </div>
              )}
            </div>
          </details>
        ),
      )}
    </div>
  );
};

export default CourseArborescence;
