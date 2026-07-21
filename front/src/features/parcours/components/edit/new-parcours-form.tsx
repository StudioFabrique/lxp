import { FC, FormEvent, useState } from "react";

import useInput from "../../../../hooks/useInput";
import { Link } from "react-router";
import { regexGeneric } from "../../../../config/constantes";
import Selecter from "../../../../components/UI/selecter/selecter.component";
import toast from "react-hot-toast";

type Item = {
  id: number;
  title: string;
};

type Props = {
  formations: Array<Item>;
  initialFormationId?: number;
  onSubmit: ({
    title,
    formationId,
  }: {
    title: string;
    formationId: number;
  }) => void;
};

const NewParcoursForm: FC<Props> = ({
  formations,
  initialFormationId,
  onSubmit,
}) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const [formationId, setFormationId] = useState<number | undefined>(
    initialFormationId,
  );

  /**
   * sélectionne la formation
   * @param id number
   */
  const handleFormation = (id: number) => {
    if (Number !== undefined) {
      setFormationId(id);
    }
  };

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * soumission du formulaire s'il est valide, affichage d'un message d'erreur dans le cas contraire
   * @param event FormEvent
   */
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (title.isValid) {
      if (formationId !== undefined && formationId > 0) {
        onSubmit({ title: title.value, formationId });
      } else {
        toast.error("Sélectionnez une formation");
      }
    } else {
      toast.error("Donnez un titre à votre parcours");
    }
  };

  return (
    <>
      <div className="font-bold">
        <div className="flex flex-col gap-y-4">
          <h3>Créer un nouveau parcours</h3>
          <div className="flex flex-col gap-y-4">
            <Selecter
              list={formations}
              title="A quelle formation souhaitez-vous attacher ce parcours ?"
              defaultItem={{ id: initialFormationId ?? 0, title: "" }}
              onSelectItem={handleFormation}
            />
            <Link
              className="text-xs underline font-normal pl-2"
              to="/admin/formation"
            >
              Formation inexistante ? Créer une formation
            </Link>
          </div>
        </div>
      </div>
      <form
        className="w-full flex flex-col gap-y-8 mt-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="title">
            Donner un nom au parcours
          </label>
          <input
            className={setInputStyle(title.hasError)}
            name="title"
            id="title"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
            placeholder="Exemple: CDA - Promo 2023"
            disabled={!formationId}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            className="btn btn-primary"
            disabled={!formationId || !title.isValid}
          >
            Créer
          </button>
        </div>
      </form>
    </>
  );
};

export default NewParcoursForm;
