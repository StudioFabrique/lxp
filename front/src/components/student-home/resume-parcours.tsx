import { Link, useLocation } from "react-router-dom";
import ImageHeader from "../image-header";
import { BookMarkedIcon, List, PlayCircleIcon, RocketIcon } from "lucide-react";
import useHttp from "../../hooks/use-http";
import { useEffect, useState } from "react";
import Parcours from "../../utils/interfaces/parcours";
import ParcoursStatistiques from "./parcours-statistiques/parcours-statistiques";
import defaultImage from "../../assets/images/module-default.jpg";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";

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
        title={parcours ? `${parcours.title}` : ""}
        titleIcon={<RocketIcon className="stroke-white" />}
        subTitle={parcours ? `${parcours.formation.title}` : ""}
        subTitleIcon={<BookMarkedIcon className="stroke-white" />}
        hidePublished
        children={[
          <div
            key="title-and-badges"
            className="absolute md:-top-[200%] -top-[160%] flex justify-between w-[95%] overflow-x-hidden"
          />,
          <div key="link" className="p-5 w-full flex justify-end">
            {parcours ? (
              <div className="flex flex-col h-[17.5em] justify-between gap-5">
                <Link
                  to={`/${currentRoute}/parcours`}
                  className="z-20 btn btn-sm"
                >
                  <List />
                  <p>Accéder à la liste des autres parcours</p>
                </Link>
                <Link
                  to={
                    parcours
                      ? `/${currentRoute}/parcours/view/${parcours.id}`
                      : `/${currentRoute}/parcours`
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
