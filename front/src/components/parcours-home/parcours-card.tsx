// Import des dépendances React et React Router
import { Link } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Parcours from "../../utils/interfaces/parcours";
import DeleteIcon from "../UI/svg/delete-icon.component";
import EditIcon from "../UI/svg/edit-icon";
import Can from "../UI/can/can.component";
import { useEffect, useState } from "react";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import { truncateText } from "../../helpers/truncate-text";
import bgImageGradient from "../../utils/bg-image-gradient";

// Interface définissant les props du composant
interface ParcoursCardProps {
  parcours: Parcours;
  onDeleteParcours: (parcours: Parcours) => void;
}

// Composant principal affichant une carte pour un parcours
const ParcoursCard = (props: ParcoursCardProps) => {
  const { parcours, onDeleteParcours } = props;
  // State pour stocker l'URL de l'image
  const [image, setImage] = useState<string | null>(null);

  // Gestionnaire de suppression d'un parcours
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteParcours = (parcours: Parcours) => {
    onDeleteParcours(parcours);
  };

  // Effect pour gérer l'affichage de l'image du parcours
  useEffect(() => {
    if (!parcours.thumb) {
      setImage("/images/parcours-default.jpg");
    } else {
      setImage(`data:image/jpeg;base64,${parcours.thumb}`);
    }
  }, [parcours.thumb]);

  // Style pour l'image de fond
  const classImage: React.CSSProperties = {
    backgroundImage: image ? bgImageGradient(image) : "none",
    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  return (
    // Container principal de la carte
    <div className="card w-96 h-full bg-base-100 shadow-xl border border-primary/20">
      {/* Section de l'image */}
      <figure style={classImage}>
        {/* Bouton d'aperçu positionné sur l'image */}
        <div className="flex items-center  absolute bottom-2 right-2">
          <Can action="update" object="parcours">
            <div className="tooltip tooltip-left" data-tip="Aperçu du parcours">
              <Link
                className="btn btn-sm btn-primary btn-circle rounded-md"
                to={`view/${parcours.id}`}
                aria-label="Aperçu du parcours"
              >
                <div className="w-5 h-5 ">
                  <ArrowTopRightIcon />
                </div>
              </Link>
            </div>
          </Can>
        </div>
      </figure>

      {/* Corps de la carte */}
      <div className="card-body w-full flex flex-col justify-between pt-4">
        {/* En-tête avec titre et statut */}
        <div className="flex flex-col gap-y-2 mb-4">
          <span className="flex justify-between items-center">
            <h2
              className="card-title text-primary tooltip tooltip-bottom"
              data-tip={parcours.title}
            >
              {truncateText(parcours.title, 25)}
            </h2>

            <p className="font-bold flex justify-end">
              {parcours.isPublished ? "Publié" : "Brouillon"}
            </p>
          </span>
          <h2
            className="card-title text-sm text-left font-normal tooltip tooltip-bottom"
            data-tip={parcours.formation.title}
          >
            {truncateText(parcours.formation.title, 25)}
          </h2>
        </div>
        {/* Informations détaillées du parcours */}
        <div className="flex flex-col items-start gap-y-1 mb-4 w-full">
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Niveau :</p>
            <p className="flex justify-end">{parcours.formation.level}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Dernière màj :</p>
            <p className="flex justify-end">
              {localeDate(parcours.updatedAt!)}
            </p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Auteur :</p>
            <p
              className="flex justify-end capitalize tooltip tooltip-bottom"
              data-tip={parcours.author}
            >
              {truncateText(parcours.author, 20)}
            </p>
          </span>
        </div>

        {/* Actions disponibles (suppression et modification) */}
        <div className="card-actions w-full flex items-center justify-between">
          <div aria-label="suppression du parcours">
            <Can action="delete" object="parcours">
              <div
                className="tooltip tooltip-bottom flex-items-center"
                data-tip="Supprimer le parcours"
              >
                <button
                  className="btn btn-sm btn-outline btn-circle rounded-md btn-error"
                  onClick={() => handleDeleteParcours(parcours)}
                >
                  <div className="w-5 h-5">
                    <DeleteIcon />
                  </div>
                </button>
              </div>
            </Can>
          </div>

          <Can action="update" object="parcours">
            <div
              className="tooltip tooltip-bottom"
              data-tip="Modifier le parcours"
            >
              <Link
                className="btn btn-outline btn-sm btn-circle rounded-md  text-primary"
                to={`edit/${parcours.id}`}
                aria-label="modifier le parcours"
              >
                <div className="w-5 h-5">
                  <EditIcon />
                </div>
              </Link>
            </div>
          </Can>
        </div>
      </div>
    </div>
  );
};

export default ParcoursCard;
