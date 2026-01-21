import { BookMarked, BookOpenText, FilePen } from "lucide-react";
import activityIconType from "../../../utils/activity-icon-type";
import {
  ActivityImportType,
  ModuleImportType,
} from "../../../views/module/hooks/use-import-modules";
import toUpperFirstLetter from "../../../utils/toUpperFirstLetter";

type Props = {
  activeModule: ModuleImportType | null;
  onSelectActivity: (activity: ActivityImportType) => void;
  selectedActivityId?: number;
};

const ModulesImportList = ({
  activeModule,
  onSelectActivity,
  selectedActivityId,
}: Props) => {
  // Empty State : Aucun module sélectionné
  if (!activeModule)
    return (
      <div className="text-base-content/40 italic text-sm text-center mt-10">
        Sélectionnez un module ci-dessus
      </div>
    );

  // Empty State : Module vide
  if (activeModule.courses.length === 0) {
    return (
      <div className="text-base-content/40 italic text-sm p-2">
        Ce module ne contient aucun cours.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      {activeModule.courses.map((course, cIdx) => (
        <details
          key={cIdx}
          open
          className="group bg-base-100 rounded border border-base-200 shadow-sm"
        >
          {/* Titre du Cours */}
          <summary className="cursor-pointer list-none font-semibold p-2 hover:bg-base-200 transition-colors flex items-center text-base-content rounded-t">
            <BookMarked className="mr-2 w-4 h-4 group-open:hidden block" />
            <BookOpenText className="mr-2 w-4 h-4 group-open:block hidden" />
            {toUpperFirstLetter(course.title)}
          </summary>

          {/* Contenu du Cours (Leçons) */}
          <div className="pl-4 pb-2 pr-2 border-t border-base-200">
            {course.lessons.map((lesson, lIdx) => (
              <details key={lIdx} className="group mt-2">
                {/* Titre de la Leçon */}
                <summary className="cursor-pointer list-none p-1 hover:text-primary transition-colors flex items-center font-medium text-base-content/80">
                  <FilePen className="mr-2 w-4 h-4" />{" "}
                  {toUpperFirstLetter(lesson.title)}
                </summary>

                {/* Liste des Activités */}
                <div className="pl-6 flex flex-col gap-1 mt-1 border-l-2 border-base-200 ml-2">
                  {lesson.activities?.map((activity, aIdx) => {
                    const isSelected = selectedActivityId === activity.id;
                    return (
                      <button
                        key={aIdx}
                        onClick={() => onSelectActivity(activity)}
                        className={`text-left px-2 py-1.5 rounded text-xs flex items-center transition-all w-full truncate cursor-pointer
                          ${
                            isSelected
                              ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" // État Actif
                              : "hover:bg-base-200 text-base-content/60 hover:text-base-content" // État Inactif
                          }
                        `}
                      >
                        <span
                          className={`mr-2 ${isSelected ? "text-primary" : "text-base-content/50"}`}
                        >
                          {activityIconType(activity.type)}
                        </span>
                        <span className="truncate">
                          {toUpperFirstLetter(activity.title)}
                        </span>
                      </button>
                    );
                  })}

                  {/* Pas d'activités */}
                  {(!lesson.activities || lesson.activities.length === 0) && (
                    <span className="text-xs text-base-content/30 italic pl-2">
                      Aucune activité
                    </span>
                  )}
                </div>
              </details>
            ))}

            {/* Pas de leçons */}
            {course.lessons.length === 0 && (
              <div className="text-xs text-base-content/30 italic p-2">
                Aucune leçon
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  );
};

export default ModulesImportList;
