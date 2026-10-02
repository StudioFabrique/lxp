import { Link, useLocation } from "react-router";
import { GraduationCap, List, PlayCircleIcon, RocketIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { dashboardStudentApi } from "../api/dashboard-student.api";
import ParcoursStatistiques from "./parcours-statistiques/parcours-statistiques";
import defaultImage from "../../../assets/images/module-default.jpg";
import ImageHeader from "../../../../src/components/image-header/image-header";
import FadeWrapper from "../../../components/wrappers/FadeWrapper";

const ResumeParcours = () => {
  const { data: parcoursList, isSuccess } = useQuery({
    queryKey: ["parcours-as-student"],
    queryFn: dashboardStudentApi.queries.getParcoursAsStudent,
  });
  const parcours = parcoursList?.[0];

  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  return (
    <div className="flex flex-col gap-2 xl:flex-row">
      <div className="min-w-0 flex-1">
        <ImageHeader
          imageUrl={normalizeImageSource(parcours?.thumb) ?? defaultImage}
          title={parcours?.title ?? ""}
          titleIcon={<RocketIcon className="stroke-white w-5" />}
          subTitle={parcours?.formation.title ?? ""}
          subTitleIcon={<GraduationCap className="stroke-white w-5" />}
          hidePublished
          titlePosition="top"
          bottomAction={parcours ? (
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
              {parcoursList && parcoursList.length > 1 && (
                <Link
                  to={`/${currentRoute[0]}/parcours`}
                  className="btn btn-sm h-auto min-h-8 max-w-full py-2"
                >
                  <List className="shrink-0" />
                  <span className="min-w-0 whitespace-normal">
                    Accéder à la liste des autres parcours
                  </span>
                </Link>
              )}
              <Link
                to={`/${currentRoute[0]}/parcours/view/${parcours.id}`}
                className="btn btn-primary ml-auto h-auto min-h-12 max-w-full py-2 text-white"
              >
                <PlayCircleIcon className="shrink-0" />
                <span className="min-w-0 whitespace-normal">Accéder au parcours</span>
              </Link>
            </div>
          ) : undefined}
          children={[
            null,
            <div key="link" className="p-5 w-full flex justify-end">
              {!parcours && isSuccess ? (
                <FadeWrapper>
                  <p className="text-white text-4xl text-center opacity-95 select-none">
                    Votre formation sera bientôt disponible dans votre espace
                  </p>
                </FadeWrapper>
              ) : null}
            </div>,
          ]}
        />
      </div>
      {parcours && parcours.id && (
        <ParcoursStatistiques parcoursId={parcours.id} />
      )}
    </div>
  );
};

export default ResumeParcours;
