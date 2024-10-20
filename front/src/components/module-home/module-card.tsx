import { Link } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import { useState } from "react";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import DeleteIcon from "../UI/svg/delete-icon.component";
import defaultImage from "../../assets/images/module-default-thumb.png";
import { Eye } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardProps {
  stepId: number;
  module: any;
  onDelete: (id: number) => void;
}

const ModuleCard = ({ stepId, module, onDelete }: ModuleCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${module.thumb ? `data:image/jpeg;base64,${module.thumb}` : defaultImage}')`,
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
          {module.parcoursId ? (
            <Can action="update" object="parcours">
              <div
                className="tooltip tooltip-left"
                data-tip="Editer le module associé au parcours"
              >
                <Link
                  className="btn btn-sm btn-primary btn-circle rounded-md"
                  to={`/admin/parcours/edit/${module.parcoursId}?step=${stepId}`}
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
          <span
            className="card-title text-primary tooltip tooltip-bottom"
            data-tip={module.title}
          >
            <h2 className="w-full block truncate text-left">{module.title}</h2>
          </span>
          <span
            className="text-right w-full flex items-center gap-x-1 tooltip tooltip-bottom"
            data-tip={module.formation}
          >
            <p className="text-left w-full">Formation :</p>
            <div className="text-right font-normal w-full block truncate">
              {module.formation ?? "Non disponible"}
            </div>
          </span>
          <span
            className="w-full flex items-center gap-x-1 tooltip tooltip-bottom"
            data-tip={module.parcours ? module.parcours : "Non disponible"}
          >
            <p className="text-left w-full">Parcours :</p>
            <p className="text-right font-normal w-full block truncate">
              {module.parcours ? module.parcours : "Non disponible"}
            </p>
          </span>
          <span className="w-full flex gap-x-1 items-center">
            <p className="text-left">Dernière màj :</p>
            <p className="text-right font-normal">
              {localeDate(module.updatedAt!)}
            </p>
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

          <div className="flex place-items-center gap-x-2">
            <Can action="read" object="module">
              <div className="">
                {module.parcoursId ? (
                  <Link
                    className="btn btn-sm btn-primary flex justify-center place-items-center btn-circle rounded-md tooltip tooltip-bottom"
                    data-tip="Voir le module"
                    to={`/admin/module/edit/${module.id}`}
                    aria-label="Voir les détails du module"
                  >
                    <Eye />
                  </Link>
                ) : (
                  <div
                    className="text-base-content/50 tooltip tooltip-bottom"
                    data-tip="Vous ne pouvez pas modifier un module
                      attaché à une formation"
                  >
                    <Eye />
                  </div>
                )}
              </div>
            </Can>
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
    </div>
  );
};

export default ModuleCard;
