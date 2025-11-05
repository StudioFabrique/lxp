import { useState } from "react";
import { BookOpen, FileText, Rocket } from "lucide-react";
import Parcours from "../../../utils/interfaces/parcours";
import Course from "../../../utils/interfaces/course";
import JournalTimeline from "./journal-timeline";

type Props = {
  parcoursList: Parcours[];
};

const JournalTree = ({ parcoursList }: Props) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* ===== File Tree ===== */}
      <ul className="menu menu-sm bg-base-200 rounded-box max-w-xs w-full">
        {parcoursList.map((parcours) => (
          <li key={parcours.id}>
            <details open>
              <summary>
                <Rocket className="h-4 w-4" />
                {parcours.title}
              </summary>
              <ul>
                {parcours.modules?.map((module) => (
                  <li key={module.id}>
                    <details open>
                      <summary>
                        <BookOpen className="h-4 w-4" />
                        {module.title}
                      </summary>
                      <ul>
                        {module.courses?.map((course) => (
                          <li key={course.id}>
                            <a
                              className={`flex items-center gap-2 ${
                                selectedCourse?.id === course.id
                                  ? "text-primary font-semibold"
                                  : ""
                              }`}
                              onClick={() => setSelectedCourse(course)}
                            >
                              <FileText className="h-4 w-4" />
                              {course.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>

      {/* ===== Timeline ===== */}
      <div className="flex-1">
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
