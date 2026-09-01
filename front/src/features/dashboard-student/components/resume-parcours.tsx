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
  const { data: parcours } = useQuery({
    queryKey: ["parcours-as-student"],
    queryFn: dashboardStudentApi.queries.getParcoursAsStudent,
    select: (data) => data[0],
  });

  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  return (
    <div className="flex flex-row gap-2 max-[1799px]:flex-col">
      <div className="min-w-0 flex-1">
        <ImageHeader
          imageUrl={normalizeImageSource(parcours?.thumb) ?? defaultImage}
          title={parcours?.title ?? ""}
          titleIcon={<RocketIcon className="stroke-white w-5" />}
          subTitle={parcours?.formation.title ?? ""}
          subTitleIcon={<GraduationCap className="stroke-white w-5" />}
          hidePublished
          children={[
            <div
              key="title-and-badges"
              className="absolute md:top-[-200%] top-[-160%] flex justify-between w-[95%] overflow-x-hidden"
            />,
            <div key="link" className="p-5 w-full flex justify-end">
              {parcours ? (
                <div className="flex flex-col h-[17.5em] justify-between gap-5">
                  <Link
                    to={`/${currentRoute[0]}/parcours`}
                    className="z-10 btn btn-sm"
                  >
                    <List />
                    <p>Accéder à la liste des autres parcours</p>
                  </Link>
                  <Link
                    to={
                      parcours
                        ? `/${currentRoute[0]}/parcours/view/${parcours.id}`
                        : `/${currentRoute[0]}/parcours`
                    }
                    className="z-10 btn btn-primary text-white"
                  >
                    <PlayCircleIcon />
                    <p>Accéder au parcours</p>
                  </Link>
                </div>
              ) : (
                <FadeWrapper>
                  <p className="text-white text-4xl text-center opacity-95 select-none">
                    Votre formation sera bientôt disponible dans votre espace
                  </p>
                </FadeWrapper>
              )}
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
