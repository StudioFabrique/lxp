import { FC, FormEvent, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import useInput from "../../hooks/use-input";
import { Link } from "react-router-dom";
import { regexGeneric } from "../../utils/constantes";
import Selecter from "../UI/selecter/selecter.component";

type Item = {
  id: number;
  title: string;
};

type Props = {
  formations: Array<Item>;
  onSubmit: ({
    title,
    formationId,
  }: {
    title: string;
    formationId: number;
  }) => void;
};

const NewParcoursForm: FC<Props> = ({ formations, onSubmit }) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const [formationId, setFormationId] = useState<number | undefined>(undefined);

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
        toast.error("Veuillez sélectionner une formation svp");
      }
    } else {
      toast.error("Veuillez donner un titre à votre parcours svp");
    }
  };

  return (
    <>
      <Toaster />
      <div className="font-bold">
        <div className="flex flex-col gap-y-4">
          <h3>Formation</h3>
          <div className="flex flex-col gap-y-4">
            <Selecter
              list={formations}
              title="Choisissez une formation"
              onSelectItem={handleFormation}
            />
            <Link className="text-xs underline font-normal pl-2" to="#">
              Créer une nouvelle formation
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
            Titre du parcours
          </label>
          <input
            className={setInputStyle(title.hasError)}
            name="title"
            id="title"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
            placeholder="Exemple: CDA - Promo 2023"
          />
        </div>
        <div className="w-full flex justify-end">
          <button className="btn btn-primary">Commencer</button>
        </div>
      </form>
    </>
  );
};

export default NewParcoursForm;
