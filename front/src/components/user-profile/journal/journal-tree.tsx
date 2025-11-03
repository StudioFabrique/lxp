import { useState } from "react";
import { BookOpen, Component, Rocket } from "lucide-react";
import Parcours from "../../../utils/interfaces/parcours";
import Course from "../../../utils/interfaces/course";
import JournalTimeline from "./journal-timeline";

type Props = {
  parcoursList: Parcours[];
};

const JournalTree = ({ parcoursList }: Props) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="flex flex-row gap-8 max-h-[70vh]">
      {/* ===== File Tree ===== */}
      <ul className="menu menu-sm bg-base-200 rounded-box max-w-xs w-[35%] overflow-y-scroll">
        {parcoursList.map((parcours) => (
          <li key={parcours.id}>
            <details open>
              <summary>
                <Rocket className="h-4 w-4" />
                {parcours.title}
              </summary>
              <ul>
                {parcours.modules?.map((module) => (
                  <>
                    <li key={module.id}>
                      <details open>
                        <summary>
                          <Component className="h-4 w-4" />
                          {module.title}
                        </summary>
                        <ul>
                          {module.courses?.map((course) => (
                            <li key={course.id}>
                              <a
                                className={`flex items-center gap-2 ${
                                  selectedCourse?.id === course.id
                                    ? "text-primary font-semibold underline"
                                    : ""
                                }`}
                                onClick={() => setSelectedCourse(course)}
                              >
                                <BookOpen className="h-4 w-4" />
                                {course.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  </>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      {/* ===== Timeline ===== */}
      <div className="overflow-y-scroll border-base-300 border-[1px] rounded-lg w-full">
        {selectedCourse ? (
          <JournalTimeline course={selectedCourse} />
        ) : (
          <div className="p-6 text-base-content/60">
            Sélectionnez un <span className="font-semibold">cours</span> pour
            voir vos accomplissements.
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalTree;
