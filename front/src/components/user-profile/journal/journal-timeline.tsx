import { CheckCircle } from "lucide-react";
import Course from "../../../utils/interfaces/course";

type Props = {
  course: Course;
};

const JournalTimeline = ({ course }: Props) => {
  const accomplishments = course.accomplishments ?? [];

  return (
    <div className="p-4 flex flex-col">
      <h3 className="text-xl font-bold text-primary mb-6">{course.title}</h3>

      {accomplishments.length > 0 ? (
        <ul className="timeline timeline-vertical">
          {accomplishments.map((acc, index) => (
            <li key={acc.id} className="self-start">
              {index > 0 && <hr />}
              <div className="timeline-start text-sm text-base-content/70">
                {acc.accomplishedAt &&
                  new Date(acc.accomplishedAt).toLocaleString("fr")}
              </div>
              <div className="timeline-middle">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="timeline-end timeline-box text-base-content">
                {acc.description}
              </div>
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base-content/60">
          Aucun accomplissement enregistré pour ce cours.
        </p>
      )}
    </div>
  );
};

export default JournalTimeline;
