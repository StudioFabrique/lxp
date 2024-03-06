import { FC } from "react";
import { Link } from "react-router-dom";

const GroupsHeader: FC<{
  onSubmit: () => void;
  title?: string;
  hideCancelButton?: boolean;
}> = ({
  onSubmit,
  title = "Créer un groupe de formation",
  hideCancelButton = false,
}) => {
  const handleClick = () => {
    onSubmit();
  };
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8">
      <div>
        <h2 className="text-4xl text-base-content font-bold">{title}</h2>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna
          eget pura.
        </p>
      </div>
      <div className="flex items-center gap-x-2 justify-center md:justify-end">
        {!hideCancelButton && (
          <Link
            to=".."
            type="button"
            className="btn btn-outline md:w-32 normal-case"
          >
            Annuler
          </Link>
        )}
        <button
          onClick={handleClick}
          type="button"
          className="btn btn-primary md:w-32 normal-case"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};
export default GroupsHeader;
