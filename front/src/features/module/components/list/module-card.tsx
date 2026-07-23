import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { useState } from "react";
import FadeWrapper from "../../../../components/wrappers/FadeWrapper";
import defaultImage from "../../../../assets/images/module-default-thumb.png";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { bgImageGradient } from "../../../../utils/helpers/color-helpers";
import { localeDate } from "../../../../utils/helpers/locale-date";
import { normalizeImageSource } from "../../../../utils/images/image-source";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardProps {
  module: any;
  onDelete: (id: number) => void;
}

const ModuleCard = ({ module, onDelete }: ModuleCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const coursesCount = module.coursesCount ?? module.courses?.length ?? 0;

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      normalizeImageSource(module.thumb) ?? defaultImage,
    ),
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
    <div className="card w-72 bg-base-100 shadow-xl border border-primary/20 font-bold">
      <figure style={classImage}>
        {/* position relative à l'image affichée */}
        <div className="flex items-center  absolute bottom-2 right-2">
          {module.parcoursId ? (
            <PermissionGuard action="update" object="module">
              <div
                className="tooltip tooltip-left"
                data-tip="Editer le module associé au parcours"
              >
                <Link
                  className="btn btn-sm btn-primary btn-circle rounded-md"
                  to={`/admin/parcours/edit/${module.parcoursId}?step=4&moduleId=${module.id}`}
                  aria-label="Modifier le module"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
              </div>
            </PermissionGuard>
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
                  {coursesCount === 0 ? "Aucun" : coursesCount}
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
            <PermissionGuard action="read" object="module">
              <div className="">
                {module.parcoursId ? (
                  <Link
                    className="btn btn-sm btn-primary flex justify-center place-items-center btn-circle rounded-md tooltip tooltip-bottom"
                    data-tip="Voir le module"
                    to={`/admin/parcours/module/${module.id}`}
                    aria-label="Prévisualiser le module"
                  >
                    <Eye />
                  </Link>
                ) : (
                  <div
                    className="text-base-content/50 tooltip tooltip-bottom"
                    data-tip="Vous ne pouvez pas modifier un module
                      non rattaché à un parcours"
                  >
                    <Eye />
                  </div>
                )}
              </div>
            </PermissionGuard>
            <div aria-label="suppression du module">
              <PermissionGuard action="delete" object="module">
                <div
                  className="tooltip tooltip-bottom flex-items-center"
                  data-tip="Supprimer le module"
                >
                  <button
                    className="btn btn-sm btn-outline btn-circle rounded-md btn-error"
                    onClick={() => onDelete(module.id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </PermissionGuard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
