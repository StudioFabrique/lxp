import { Link, useLocation } from "react-router-dom";
import ImageHeader from "../image-header";
import { PlayCircleIcon } from "lucide-react";
import LessonRead from "../../utils/interfaces/lesson-read";
import useHttp from "../../hooks/use-http";
import { useEffect, useState } from "react";

type ResumeActivityProps = {
  lastLesson: LessonRead;
};

const ResumeActivity = ({ lastLesson }: ResumeActivityProps) => {
  const { sendRequest, isLoading } = useHttp();
  const [image, setImage] = useState<string>();

  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  useEffect(() => {
    const applyData = (data: { data: { image: string } }) => {
      setImage(`data:image/jpeg;base64,${data.data.image}`);
    };

    sendRequest(
      {
        path: `/modules/image/${lastLesson.lesson.course.module.id}`,
      },
      applyData
    );
  }, [lastLesson.lesson.course.module.id, sendRequest]);

  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={isLoading ? "" : image ?? "/images/parcours-default.webp"}
        title={`Cours: ${lastLesson.lesson.course.title}`}
        subTitle={`Leçon: ${lastLesson.lesson.title}`}
        children={[
          <div
            key="title-and-badges"
            className="absolute md:-top-[230%] -top-[160%] flex justify-between w-full items-center"
          >
            <p className="text-white">{`Module: ${lastLesson.lesson.course.module.title}`}</p>
            <div className="flex gap-1 overflow-x-hidden pr-10">
              {lastLesson.lesson.course.bonusSkills &&
                lastLesson.lesson.course.bonusSkills
                  .filter((skill) => skill.badge)
                  .map(
                    (skill, i) =>
                      i < 5 && (
                        <img
                          key={skill.id}
                          className="w-12 h-12 p-2"
                          src={skill.badge}
                          alt="illustration badge"
                        />
                      )
                  )}
            </div>
          </div>,
          <div key="link" className="p-5 w-full flex justify-end">
            <Link
              to={`/${currentRoute}/parcours/module/${lastLesson.lesson.course.module.id}`}
              state={{ lessonId: lastLesson.lesson.id }}
              className="z-20 btn btn-primary text-white flex"
            >
              <PlayCircleIcon />
              <p>{lastLesson.beganAt ? "Reprendre" : "Démarrer"}</p>
            </Link>
          </div>,
        ]}
      />
      <div className="text-primary grid grid-rows-4 gap-2">
        <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
          <p>Diplôme</p>
          <p className="font-bold text-lg">Bac +3</p>
        </span>
        <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
          <p>Semaine</p>
          <p className="font-bold text-lg">12</p>
        </span>
        <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
          <p>Heure</p>
          <p className="font-bold text-lg">457</p>
        </span>
        <span className="flex flex-col justify-center items-center bg-secondary text-secondary-content rounded-lg p-2">
          <p>Modules</p>
          <p className="font-bold text-lg">8</p>
        </span>
      </div>
    </div>
  );
};

export default ResumeActivity;
