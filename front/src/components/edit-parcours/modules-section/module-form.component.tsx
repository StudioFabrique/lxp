import { useSelector } from "react-redux";

import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexNumber,
  regexOptionalGeneric,
} from "../../../utils/constantes";
import Contact from "../../../utils/interfaces/contact";
import Contacts from "../informations/contacts";

const ModuleForm = () => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: duration } = useInput((value) => regexNumber.test(value));

  const { value: description } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );

  const listeContacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];

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
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setAreaStyle = (hasError: boolean) => {
    return hasError
      ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
      : "textarea textarea-sm textarea-bordered focus:outline-none w-full";
  };

  const handleSubmitContacts = () => {};

  return (
    <form className="w-full grid grid-cols-2 gap-8">
      <article className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-4">
          <label htmlFor="title">Titre du module *</label>
          <input
            className={setInputStyle(title.hasError)}
            id="title"
            name="title"
            type="text"
            defaultValue={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
            placeholder="Exemple: CDA - Promo 2023"
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="description">Description</label>
          <textarea
            className={setAreaStyle(description.hasError)}
            id="description"
            name="description"
            rows={3}
            defaultValue={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="duration">Nombre d'heures</label>
          <input
            className={setInputStyle(title.hasError)}
            id="duration"
            name="duration"
            defaultValue={duration.value}
            onChange={duration.valueChangeHandler}
            onBlur={duration.valueBlurHandler}
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="image">Téléverser une image</label>
        </div>
      </article>

      <article>
        <div className="flex flex-col gap-y-4">
          <label htmlFor="level">Formateurs du module</label>
          <Contacts onSubmitContacts={handleSubmitContacts} />
        </div>
      </article>
    </form>
  );
};

export default ModuleForm;
