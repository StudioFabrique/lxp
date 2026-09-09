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
import SkillBadgeSummary from "./skill-badge-summary";

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
  const parcoursId =
    lastLesson.parcoursId ?? lastLesson.lesson.course.module.parcours?.id;

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
              className="absolute md:top-[-200%] top-[-160%] flex justify-between w-[95%]"
            >
              <div className="flex min-w-0 gap-2">
                <ComponentIcon className="shrink-0 stroke-white" />
                <p className="truncate text-white">{`${lastLesson.lesson.course.module.title}`}</p>
              </div>
              <SkillBadgeSummary
                skills={lastLesson.lesson.course.bonusSkills}
                className="rounded-xl border border-white/20 bg-base-100/50 p-1.5 shadow-sm backdrop-blur-sm"
              />
            </div>,
            <div key="link">
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
            </div>,
          ]}
        />
      </div>
      {parcoursId ? (
        <ParcoursStatistiques parcoursId={parcoursId} />
      ) : null}
    </div>
  );
};

export default ResumeActivity;
