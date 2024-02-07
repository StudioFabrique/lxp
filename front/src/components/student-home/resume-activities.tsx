import { ArrowUpRightIcon } from "lucide-react";
import LessonRead from "../../utils/interfaces/lesson-read";

type ResumeActivitiesProps = {
  lastLessons: LessonRead[];
};

const ResumeActivities = ({ lastLessons }: ResumeActivitiesProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">
        Reprendre mes activités là où je m'étais arrêté
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {lastLessons.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col p-5 bg-secondary rounded-lg gap-10`}
          >
            <span>
              <p>{`Module: ${item.lesson.course.module.title}`}</p>
              <p>{`Cours: ${item.lesson.course.title}`}</p>
            </span>
            <span className="flex justify-between">
              <p>{item.lesson.title}</p>
              <ArrowUpRightIcon />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeActivities;
