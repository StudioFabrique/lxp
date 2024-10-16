import { FC } from "react";
import { Link } from "react-router-dom";

const UserFormHeader: FC<{
  onSubmit: () => void;
  title?: string;
  disabled?: boolean;
}> = ({ onSubmit, title, disabled }) => {
  const handleClick = () => {
    onSubmit();
  };
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8">
      <div>
        <h2 className="text-4xl text-base-content font-bold">
          {title ?? "Créer un utilisateur"}
        </h2>
        <p className="mt-2">Modifier les informations d'un utilisateur.</p>
      </div>
      <div className="flex items-center gap-x-2 justify-center md:justify-end">
        <Link to=".." className="btn btn-outline md:w-32 normal-case">
          Annuler
        </Link>
        <button
          onClick={handleClick}
          type="button"
          className="btn btn-primary md:w-32 normal-case"
          disabled={disabled}
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};
export default UserFormHeader;
