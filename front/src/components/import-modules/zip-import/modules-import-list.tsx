import {
  ActivityImportType,
  ModuleImportType,
} from "../../../views/module/hooks/use-import-modules";
import { ActivityType } from "../../../utils/interfaces/activity";

type Props = {
  activeModule: ModuleImportType | null; // Changement ici : un seul module
  onSelectActivity: (activity: ActivityImportType) => void;
  selectedActivityId?: number;
};

const Icons = {
  Course: () => <span className="mr-2">🎓</span>,
  Lesson: () => <span className="mr-2">📄</span>,
  Activity: ({ type }: { type: ActivityType }) => {
    switch (type) {
      case "text":
        return (
          <span className="mr-2 text-blue-500 font-mono text-xs">[T]</span>
        );
      case "file":
        return (
          <span className="mr-2 text-orange-500 font-mono text-xs">[F]</span>
        );
      default:
        return <span className="mr-2">?</span>;
    }
  },
};

const ModulesImportList = ({
  activeModule,
  onSelectActivity,
  selectedActivityId,
}: Props) => {
  if (!activeModule)
    return (
      <div className="text-gray-400 italic text-sm text-center mt-10">
        Sélectionnez un module ci-dessus
      </div>
    );

  if (activeModule.courses.length === 0) {
    return (
      <div className="text-gray-400 italic text-sm p-2">
        Ce module ne contient aucun cours.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-sm">
      {/* On itère directement sur les cours du module actif */}
      {activeModule.courses.map((course, cIdx) => (
        <details
          key={cIdx}
          open
          className="group bg-white rounded border border-gray-200 shadow-sm"
        >
          <summary className="cursor-pointer list-none font-semibold p-2 hover:bg-gray-50 flex items-center text-gray-800">
            <Icons.Course /> {course.title}
          </summary>

          <div className="pl-4 pb-2 pr-2 border-t border-gray-100">
            {course.lessons.map((lesson, lIdx) => (
              <details key={lIdx} className="group mt-2">
                <summary className="cursor-pointer list-none p-1 hover:text-blue-600 flex items-center font-medium text-gray-600">
                  <Icons.Lesson /> {lesson.title}
                </summary>

                <div className="pl-6 flex flex-col gap-1 mt-1 border-l-2 border-gray-100 ml-2">
                  {lesson.activities?.map((activity, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => onSelectActivity(activity)}
                      className={`text-left px-2 py-1.5 rounded text-xs flex items-center transition-all w-full truncate
                        ${
                          selectedActivityId === activity.id
                            ? "bg-blue-100 text-blue-800 font-bold border-l-4 border-blue-500"
                            : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                        }
                      `}
                    >
                      <Icons.Activity type={activity.type} />
                      <span className="truncate">{activity.title}</span>
                    </button>
                  ))}
                  {(!lesson.activities || lesson.activities.length === 0) && (
                    <span className="text-xs text-gray-300 italic pl-2">
                      Aucune activité
                    </span>
                  )}
                </div>
              </details>
            ))}
            {course.lessons.length === 0 && (
              <div className="text-xs text-gray-300 italic p-2">
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
