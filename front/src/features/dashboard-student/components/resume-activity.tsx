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
import PermissionGuard from "../../../components/guards/PermissionGuard";

type ResumeActivityProps = {
  lastLesson: LessonRead;
};

const capitalizeFirstLetter = (value: string) =>
  value.length > 0
    ? `${value.charAt(0).toLocaleUpperCase("fr-FR")}${value.slice(1)}`
    : value;

const ResumeActivity = ({ lastLesson }: ResumeActivityProps) => {
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const { data: imageBlob, isLoading } = useQuery({
    queryKey: ["module-image", lastLesson.lesson.course.module.id],
    queryFn: () =>
      dashboardStudentApi.queries.getModuleImage(
        lastLesson.lesson.course.module.id!,
      ),
    enabled: !!lastLesson.lesson.course.module.id,
  });

  const image = imageBlob ? normalizeImageSource(imageBlob) : defaultImage;

  return (
    <div className="flex flex-col gap-2 xl:flex-row">
      <div className="min-w-0 flex-1">
        <ImageHeader
          imageUrl={isLoading ? "" : (image ?? "")}
          title={`Leçon ${(lastLesson.lesson.order ?? 0) + 1} : ${capitalizeFirstLetter(lastLesson.lesson.title)}`}
          titleIcon={<FileEditIcon className="stroke-white w-5" />}
          subTitle={`Cours ${(lastLesson.lesson.course.order ?? 0) + 1} : ${capitalizeFirstLetter(lastLesson.lesson.course.title)}`}
          subTitleIcon={
            <div className="text-white w-5">
              <BookMarked />
            </div>
          }
          reserveActionSpace
          hidePublished
          children={[
            <div
              key="title-and-badges"
              className="absolute md:top-[-200%] top-[-160%] flex justify-between w-[95%] overflow-x-hidden"
            >
              <div className="flex gap-2">
                <ComponentIcon className="stroke-white" />
                <p className="text-white">{`${lastLesson.lesson.course.module.title}`}</p>
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
              <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-5 pb-9">
                <Link
                  to={`/${currentRoute[0]}/parcours/module/${lastLesson.lesson.course.module.id}`}
                  state={{ lessonId: lastLesson.lesson.id }}
                  aria-label={lastLesson.beganAt ? "Reprendre" : "Démarrer"}
                  className="pointer-events-auto z-10 btn btn-primary text-base-100 flex"
                >
                  <PlayCircleIcon />
                  <p className="hidden sm:block">
                    {lastLesson.beganAt ? "Reprendre" : "Démarrer"}
                  </p>
                </Link>
              </div>
            </PermissionGuard>,
          ]}
        />
      </div>
      {lastLesson.parcoursId ? (
        <ParcoursStatistiques parcoursId={lastLesson.parcoursId} />
      ) : null}
    </div>
  );
};

export default ResumeActivity;
