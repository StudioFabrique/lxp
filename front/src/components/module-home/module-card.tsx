import { localeDate } from "../../helpers/locale-date";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModuleCardProps {
  module: any;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
  const classImage: React.CSSProperties = {
    backgroundImage: `url('${`data:image/jpeg;base64,${module.thumb}`}')`,
    width: "100%",
    height: "9rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  return (
    <div className="card w-96 h-full bg-base-100 shadow-xl border border-primary/20">
      <figure style={classImage} />

      <div className="card-body w-full flex flex-col justify-between pt-4">
        <div className="flex flex-col gap-y-2 mb-4">
          <h2 className="card-title text-primary">{module.title}</h2>

          {!module.formations ? (
            <span>
              <h2 className="card-title text-primary">{module.formation}</h2>
              <h2>Formation</h2>
            </span>
          ) : (
            <span>
              <h2 className="card-title text-primary">{module.parcours}</h2>
              <h2>Parcours</h2>
            </span>
          )}
        </div>
        <div className="flex flex-col items-start gap-y-1 mb-4 w-full">
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Dernière màj :</p>
            <p className="flex justify-end">{localeDate(module.updatedAt!)}</p>
          </span>
          <span className="flex justify-between gap-x-4 items-center w-full">
            <p className="font-bold w-24">Auteur :</p>
            <p className="flex justify-end capitalize">{module.author}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
