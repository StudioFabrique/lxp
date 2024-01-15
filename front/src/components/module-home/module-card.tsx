import { Link } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import { useState } from "react";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import DeleteIcon from "../UI/svg/delete-icon.component";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardProps {
  stepId: number;
  module: any;
  onDelete: (id: number) => void;
}

const ModuleCard = ({ stepId, module, onDelete }: ModuleCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${`data:image/jpeg;base64,${module.thumb}`}')`,
    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  const handleToggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl border border-primary/20 font-bold">
      <figure style={classImage}>
        {/* position relative à l'image affichée */}
        <div className="flex items-center  absolute bottom-2 right-2">
          {module.parcours ? (
            <Can action="update" object="parcours">
              <div
                className="tooltip tooltip-left"
                data-tip="Editer le module associé au parcours"
              >
                <Link
                  className="btn btn-sm btn-primary btn-circle rounded-md"
                  to={`/admin/parcours/edit/${module.parcours.id}?step=${stepId}`}
                  aria-label="Aperçu du parcours"
                >
                  <div className="w-5 h-5 ">
                    <ArrowTopRightIcon />
                  </div>
                </Link>
              </div>
            </Can>
          ) : null}
        </div>
      </figure>

      <div className="card-body w-full flex flex-col pt-4">
        <div className="flex flex-col gap-y-2 mb-4">
          <h2 className="card-title text-primary">{module.title}</h2>
          <span className="w-fit flex items-center gap-x-1">
            <p>Formation :</p>
            <p className="font-normal">
              {module.formation ?? "Non disponible"}
            </p>
          </span>
          <span className="w-fit flex items-center gap-x-1">
            <p>Parcours :</p>
            <p className="font-normal">
              {module.parcours ? module.parcours.title : "Non disponible"}
            </p>
          </span>
          <span className="w-fit flex gap-x-1 items-center">
            <p>Dernière màj :</p>
            <p className="font-normal">{localeDate(module.updatedAt!)}</p>
          </span>
        </div>
        {showDetails ? (
          <FadeWrapper>
            <div className="flex flex-col items-start gap-y-1 mb-4 w-full">
              <span className="flex gap-x-1 items-center">
                <p>Auteur :</p>
                <p className="capitalize font-normal">{module.author}</p>
              </span>
              <span className="flex gap-x-1 items-center">
                <p>Cours :</p>
                <p className="font-normal">
                  {module.courses.length === 0
                    ? "Aucun"
                    : module.courses.length}
                </p>
              </span>
            </div>
          </FadeWrapper>
        ) : null}
        <div className="w-full flex justify-between items-center">
          <p
            className="text-xs text-primary underline font-normal cursor-pointer"
            onClick={handleToggleDetails}
          >
            {showDetails ? "Fermer" : "Détails"}
          </p>

          <div aria-label="suppression du module">
            <Can action="delete" object="module">
              <div
                className="tooltip tooltip-bottom flex-items-center"
                data-tip="Supprimer le module"
              >
                <button
                  className="btn btn-sm btn-outlne btn-circle rounded-md btn-error"
                  onClick={() => onDelete(module.id)}
                >
                  <div className="w-5 h-5">
                    <DeleteIcon />
                  </div>
                </button>
              </div>
            </Can>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
