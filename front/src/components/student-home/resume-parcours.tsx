import { Link, useLocation } from "react-router-dom";
import ImageHeader from "../image-header";
import { PlayCircleIcon } from "lucide-react";
import useHttp from "../../hooks/use-http";
import { useEffect, useState } from "react";
import Parcours from "../../utils/interfaces/parcours";

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
      applyData
    );
  }, [sendRequest]);

  return (
    <div className="flex gap-2">
      <ImageHeader
        imageUrl={
          parcours?.thumb
            ? `data:image/jpeg;base64,${parcours?.thumb}`
            : "/images/parcours-default.webp"
        }
        title={parcours ? `Formation: ${parcours.formation.title}` : ""}
        subTitle={parcours ? `Parcours: ${parcours.title}` : ""}
        hidePublished
        children={[
          <div key="link" className="p-5 w-full flex justify-center">
            {parcours ? (
              <Link
                to={
                  parcours
                    ? `/${currentRoute}/parcours/view/${parcours.id}`
                    : `/${currentRoute}/parcours`
                }
                className="z-20 btn btn-primary text-white flex"
              >
                <PlayCircleIcon />
                <p>Accéder</p>
              </Link>
            ) : (
              <p className="text-white text-4xl text-center">
                Votre formation sera bientôt disponible dans votre espace
              </p>
            )}
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

export default ResumeParcours;
