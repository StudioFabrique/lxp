import { Link, useNavigate } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Parcours from "../../utils/interfaces/parcours";
import DeleteIcon from "../UI/svg/delete-icon.component";
import EditIcon from "../UI/svg/edit-icon";
import EyeIcon from "../UI/svg/eye-icon";
import Can from "../UI/can/can.component";
import { useEffect, useState } from "react";

interface ParcoursCardProps {
  parcours: Parcours;
}

const ParcoursCard = ({ parcours }: ParcoursCardProps) => {
  const nav = useNavigate();
  const [image, setImage] = useState<string | null>(null);

  const handleDeleteParcours = (id: number) => {
    nav(``);
  };

  useEffect(() => {
    if (!parcours.thumb) {
      setImage("/images/parcours-default.jpg");
    } else {
      setImage(`data:image/jpeg;base64,${parcours.thumb}`);
    }
  }, [parcours.thumb]);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${image}')`,
    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  return (
    <div className="card w-96 h-full bg-base-100 shadow-xl border border-primary/20">
      <figure style={classImage}>
        {/* position relative à l'image affichée */}
        <div className="flex items-center  absolute bottom-2 right-2">
          <Can action="update" object="parcours">
            <div className="tooltip tooltip-left" data-tip="Aperçu du parcours">
              <Link
                className="btn btn-sm btn-primary btn-circle rounded-md"
                to={`view/${parcours.id}`}
                aria-label="Aperçu du parcours"
              >
                <div className="w-6 h-6 ">
                  <EyeIcon />
                </div>
              </Link>
            </div>
          </Can>
        </div>
      </figure>

      <div className="card-body w-full flex flex-col justify-between pt-4">
        <div className="flex flex-col gap-y-2 mb-4">
          <h2 className="card-title text-primary">
            {parcours.formation.title}
          </h2>
          <h2 className="card-title text-sm font-normal">{parcours.title}</h2>
        </div>
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

        <div className="card-actions w-full flex items-center justify-between">
          <div aria-label="suppression du parcours">
            <Can action="delete" object="parcours">
              <div
                className="tooltip tooltip-bottom flex-items-center"
                data-tip="Supprimer le parcours"
              >
                <button
                  className="btn btn-sm btn-outline btn-circle rounded-md btn-error"
                  onClick={() => handleDeleteParcours(parcours.id!)}
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
