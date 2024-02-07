import React from "react";
import { Link, useLocation } from "react-router-dom";
import ImageHeader from "../image-header";
import { PlayCircleIcon } from "lucide-react";
import LessonRead from "../../utils/interfaces/lesson-read";

type ResumeActivityProps = {
  lastLesson: LessonRead;
};

const ResumeActivity = ({ lastLesson }: ResumeActivityProps) => {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={/* image ?? */ "/images/parcours-default.webp"}
        title={`Module: ${lastLesson.lesson.course.module.title}`}
        subTitle={`Cours: ${lastLesson.lesson.course.title}`}
        children={[
          <React.Fragment key="fragment"></React.Fragment>,
          <div key="link" className="p-5 w-full flex justify-end">
            <Link
              to={`/${currentRoute}/parcours/module/${lastLesson.lesson.course.module.id}`}
              state={{ lessonId: lastLesson.lesson.id }}
              className="z-20 btn btn-primary text-white flex"
            >
              <PlayCircleIcon />
              <p>Démarrer</p>
            </Link>
          </div>,
        ]}
      />
      <div className="grid grid-rows-4 gap-2">
        <span className="bg-secondary rounded-lg p-2 text-center">
          <p>Diplôme</p>
          <p>Bac +3</p>
        </span>
        <span className="bg-secondary rounded-lg p-2 text-center">
          <p>Semaine</p>
          <p>12</p>
        </span>
        <span className="bg-secondary rounded-lg p-2 text-center">
          <p>Heure</p>
          <p>457</p>
        </span>
        <span className="bg-secondary rounded-lg p-2 text-center">
          <p>Modules</p>
          <p>8</p>
        </span>
      </div>
    </div>
  );
};

export default ResumeActivity;
