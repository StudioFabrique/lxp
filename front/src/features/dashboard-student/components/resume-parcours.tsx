import { Link, useLocation } from "react-router";
import { GraduationCap, List, PlayCircleIcon, RocketIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ParcoursStatistiques from "./parcours-statistiques/parcours-statistiques";
import defaultImage from "../../../assets/content-image-placeholders/module-default.jpg";
import useHttp from "../../../../src.legacy/hooks/use-http";
import Parcours from "../../../utils/interfaces/parcours";
import ImageHeader from "../../../../src.legacy/components/image-header";
import { toUpperFirstLetter } from "../../../utils/helpers/text-helpers";
import FadeWrapper from "../../../components/wrappers/FadeWrapper";

/* type ResumeParcoursProps = {
  parcours?: Parcours;
}; */

const ResumeParcours = (/* { parcours }: ResumeParcoursProps */) => {
  const { sendRequest } = useHttp();
  const [parcours, setParcours] = useState<Parcours>();

  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  useEffect(() => {
    const applyData = (data: Parcours[]) => {
      setParcours(data[0]);
    };

    sendRequest(
      {
        path: `/parcours/parcours-as-student`,
      },
      applyData,
    );
  }, [sendRequest]);

  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={
          parcours?.thumb
            ? `data:image/jpeg;base64,${parcours?.thumb}`
            : defaultImage
        }
        title={parcours ? `${toUpperFirstLetter(parcours.title)}` : ""}
        titleIcon={<RocketIcon className="stroke-white w-5" />}
        subTitle={
          parcours ? `${toUpperFirstLetter(parcours.formation.title)}` : ""
        }
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
                  className="z-20 btn btn-sm"
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
                  className="z-20 btn btn-primary text-white"
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
      {parcours && parcours.id && (
        <ParcoursStatistiques parcoursId={parcours.id} />
      )}
    </div>
  );
};

export default ResumeParcours;
