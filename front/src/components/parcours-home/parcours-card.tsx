import { Link, useNavigate } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Parcours from "../../utils/interfaces/parcours";
import DeleteIcon from "../UI/svg/delete-icon.component";
import EditIcon from "../UI/svg/edit-icon";
import EyeIcon from "../UI/svg/eye-icon";
import Can from "../UI/can/can.component";

interface ParcoursCardProps {
  parcours: Parcours;
}

const ParcoursCard = ({ parcours }: ParcoursCardProps) => {
  const nav = useNavigate();

  const handleDeleteParcours = (id: number) => {
    nav(``);
  };

  return (
    <div className="card w-92 h-full bg-base-100 shadow-xl">
      <figure className="h-[33%] flex justify-start bg-primary text-base-100 p-4">
        <div className="flex flex-col gap-y-2">
          <h2 className="card-title">{parcours.formation.title}</h2>
          <h2 className="card-title">{parcours.title}</h2>
        </div>
      </figure>
      <div className="card-body justify-between w-full items-center">
        <div className="flex flex-col items-start gap-y-1 mb-4 w-full">
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Niveau :</p>
            <p className="flex justify-end">{parcours.formation.level}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Créé le :</p>
            <p className="flex justify-end">
              {localeDate(parcours.createdAt!)}
            </p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Dernière màj :</p>
            <p className="flex justify-end">
              {localeDate(parcours.updatedAt!)}
            </p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Auteur :</p>
            <p className="flex justify-end capitalize">{parcours.author}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Status :</p>
            <p className="flex justify-end">
              {parcours.isPublished ? "Publié" : "Brouillon"}
            </p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Visibilité :</p>
            <input
              type="checkbox"
              className="toggle toggle-primary disabled:toggle-primary disabled:opacity-100 disabled:cursor-default"
              disabled
              checked={parcours.visibility}
            />
          </span>
        </div>

        <div className="card-actions w-full flex items-center justify-end">
          <div className="w-6 h-6 mt-1">
            <Can action="update" object="parcours">
              <div
                className="tooltip tooltip-bottom"
                data-tip="Aperçu du parcours"
              >
                <Link
                  className="text-primary"
                  to={`view/${parcours.id}`}
                  aria-label="Aperçu du parcours"
                >
                  <EyeIcon />
                </Link>
              </div>
            </Can>
          </div>
          <div className="w-6 h-6">
            <Can action="update" object="parcours">
              <div
                className="tooltip tooltip-bottom"
                data-tip="Modifier le parcours"
              >
                <Link
                  className="text-primary"
                  to={`edit/${parcours.id}`}
                  aria-label="modifier le parcours"
                >
                  <EditIcon />
                </Link>
              </div>
            </Can>
          </div>
          <div
            className="w-6 h-6 mt-1 text-error"
            aria-label="suppression du parcours"
          >
            <Can action="delete" object="parcours">
              <div
                className="tooltip tooltip-bottom flex-items-center"
                data-tip="Supprimer le parcours"
              >
                <div onClick={() => handleDeleteParcours(parcours.id!)}>
                  <DeleteIcon />
                </div>
              </div>
            </Can>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcoursCard;
