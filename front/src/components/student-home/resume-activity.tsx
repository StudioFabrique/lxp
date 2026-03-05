import { Link, useLocation } from "react-router-dom";
import ImageHeader from "../image-header";
import {
  BookMarked,
  ComponentIcon,
  FileEditIcon,
  PlayCircleIcon,
} from "lucide-react";
import LessonRead from "../../utils/interfaces/lesson-read";
import useHttp from "../../hooks/use-http";
import { useEffect, useState } from "react";
import ParcoursStatistiques from "./parcours-statistiques/parcours-statistiques";
import Can from "../UI/can/can.component";
import defaultImage from "../../assets/images/module-default.jpg";
import toUpperFirstLetter from "../../utils/toUpperFirstLetter";

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
      setImage(
        data.data.image
          ? `data:image/jpeg;base64,${data.data.image}`
          : defaultImage,
      );
    };

    sendRequest(
      {
        path: `/modules/image/${lastLesson.lesson.course.module.id}`,
      },
      applyData,
    );
  }, [lastLesson.lesson.course.module.id, sendRequest]);

  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={isLoading ? "" : (image ?? "")}
        title={`Leçon ${
          (lastLesson.lesson.order ?? 0) + 1
        }: ${toUpperFirstLetter(lastLesson.lesson.title)}`}
        titleIcon={<FileEditIcon className="stroke-white w-5" />}
        subTitle={`Cours ${
          (lastLesson.lesson.course.order ?? 0) + 1
        }: ${toUpperFirstLetter(lastLesson.lesson.course.title)}`}
        subTitleIcon={
          <div className="text-white w-5">
            <BookMarked />
          </div>
        }
        hidePublished
        children={[
          <div
            key="title-and-badges"
            className="absolute md:-top-[200%] -top-[160%] flex justify-between w-[95%] overflow-x-hidden"
          >
            <div className="flex gap-2">
              <p className="text-white">{`${lastLesson.lesson.course.module.title}`}</p>
              <ComponentIcon className="stroke-white" />
            </div>
            <div className="flex gap-1">
              {lastLesson.lesson.course.bonusSkills &&
                lastLesson.lesson.course.bonusSkills
                  .filter((skill) => skill.badge)
                  .map(
                    (skill, i) =>
                      i < 5 && (
                        <img
                          key={skill.id}
                          className="w-20 h-20 p-2"
                          src={skill.badge}
                          alt="illustration badge"
                        />
                      ),
                  )}
            </div>
          </div>,
          <Can key="link" action="component" object="start-lesson-button">
            <div className="p-5 w-full flex justify-end">
              <Link
                to={`/${currentRoute}/parcours/module/${lastLesson.lesson.course.module.id}`}
                state={{ lessonId: lastLesson.lesson.id }}
                className="z-[9] btn btn-primary text-neutral-content flex"
              >
                <PlayCircleIcon />
                <p>{lastLesson.beganAt ? "Reprendre" : "Démarrer"}</p>
              </Link>
            </div>
          </Can>,
        ]}
      />
      {lastLesson.parcoursId ? (
        <ParcoursStatistiques parcoursId={lastLesson.parcoursId} />
      ) : null}
    </div>
  );
};

export default ResumeActivity;
