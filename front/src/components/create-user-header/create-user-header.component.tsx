import { FC } from "react";

const CreateUserHeader: FC<{
  onSubmit: () => void;
}> = ({ onSubmit }) => {
  const handleClick = () => {
    onSubmit();
  };
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-8">
      <div>
        <h2 className="text-4xl text-base-content font-bold">
          Créer un utilisateur
        </h2>
        <p className="mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna
          eget pura.
        </p>
      </div>
      <div className="flex items-center gap-x-2 justify-center md:justify-end">
        <button type="button" className="btn btn-outline md:w-32 normal-case">
          Annuler
        </button>
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
export default CreateUserHeader;
