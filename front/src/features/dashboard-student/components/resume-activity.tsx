import { Link, useLocation } from "react-router";
import {
  BookMarked,
  ComponentIcon,
  FileEditIcon,
  PlayCircleIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { dashboardStudentApi } from "../api/dashboard-student.api";
import ParcoursStatistiques from "./parcours-statistiques/parcours-statistiques";
import defaultImage from "../../../assets/images/module-default.jpg";
import LessonRead from "../../../utils/interfaces/lesson-read";
import ImageHeader from "../../../../src/components/image-header/image-header";
import { toUpperFirstLetter } from "../../../utils/helpers/text-helpers";
import PermissionGuard from "../../../components/guards/PermissionGuard";

type ResumeActivityProps = {
  lastLesson: LessonRead;
};

const ResumeActivity = ({ lastLesson }: ResumeActivityProps) => {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const { data: imageBlob, isLoading } = useQuery({
    queryKey: ["module-image", lastLesson.lesson.course.module.id],
    queryFn: () => dashboardStudentApi.queries.getModuleImage(lastLesson.lesson.course.module.id!),
    enabled: !!lastLesson.lesson.course.module.id,
  });

  const image = imageBlob
    ? normalizeImageSource(imageBlob)
    : defaultImage;

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
            className="absolute md:top-[-200%] top-[-160%] flex justify-between w-[95%] overflow-x-hidden"
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
          <PermissionGuard
            key="link"
            action="component"
            object="start-lesson-button"
          >
            <div className="p-5 w-full flex justify-end">
              <Link
                to={`/${currentRoute[0]}/parcours/module/${lastLesson.lesson.course.module.id}`}
                state={{ lessonId: lastLesson.lesson.id }}
                className="z-9 btn btn-primary text-base-100 flex"
              >
                <PlayCircleIcon />
                <p>{lastLesson.beganAt ? "Reprendre" : "Démarrer"}</p>
              </Link>
            </div>
          </PermissionGuard>,
        ]}
      />
      {lastLesson.parcoursId ? (
        <ParcoursStatistiques parcoursId={lastLesson.parcoursId} />
      ) : null}
    </div>
  );
};

export default ResumeActivity;
