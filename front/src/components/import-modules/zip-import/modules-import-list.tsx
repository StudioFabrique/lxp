import {
  ActivityImportType,
  ModuleImportType,
} from "../../../views/module/hooks/use-import-modules";
import { ActivityType } from "../../../utils/interfaces/activity";

type Props = {
  modules?: ModuleImportType[];
  onSelectActivity: (activity: ActivityImportType) => void;
  selectedActivityId?: number;
};

// Petites icônes pour faire joli
const Icons = {
  Module: () => <span className="mr-2">📦</span>,
  Course: () => <span className="mr-2">🎓</span>,
  Lesson: () => <span className="mr-2">📄</span>,
  Activity: ({ type }: { type: ActivityType }) => {
    switch (type) {
      case "text":
        return <span className="mr-2 text-blue-500">T</span>;
      case "file":
        return <span className="mr-2 text-orange-500">F</span>;
      default:
        return <span className="mr-2">?</span>;
    }
  },
};

const ModulesImportList = ({
  modules,
  onSelectActivity,
  selectedActivityId,
}: Props) => {
  if (!modules?.length)
    return <div className="text-gray-500 italic">Aucun module à afficher</div>;

  return (
    <div className="flex flex-col gap-2 text-sm">
      {modules.map((module, mIdx) => (
        <details key={mIdx} open className="group">
          <summary className="cursor-pointer list-none font-bold p-2 bg-gray-50 rounded hover:bg-gray-100 flex items-center">
            <Icons.Module /> {module.title}
          </summary>

          <div className="pl-4 mt-1 flex flex-col gap-1">
            {module.courses.map((course, cIdx) => (
              <details key={cIdx} open className="group">
                <summary className="cursor-pointer list-none font-semibold p-1 hover:text-blue-600 flex items-center">
                  <Icons.Course /> {course.title}
                </summary>

                <div className="pl-4 border-l-2 border-gray-200 ml-1">
                  {course.lessons.map((lesson, lIdx) => (
                    <details key={lIdx} className="group mb-1">
                      <summary className="cursor-pointer list-none p-1 hover:text-blue-600 flex items-center">
                        <Icons.Lesson /> {lesson.title}
                      </summary>

                      <div className="pl-4 flex flex-col">
                        {lesson.activities?.map((activity, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => onSelectActivity(activity)}
                            className={`text-left p-2 rounded text-xs flex items-center transition-colors
                                                    ${
                                                      selectedActivityId ===
                                                      activity.id
                                                        ? "bg-blue-100 text-blue-800 font-medium"
                                                        : "hover:bg-gray-50"
                                                    }
                                                `}
                          >
                            <Icons.Activity type={activity.type} />
                            {activity.title}
                          </button>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
};

export default ModulesImportList;
