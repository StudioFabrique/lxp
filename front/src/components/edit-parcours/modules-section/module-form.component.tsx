import { useSelector } from "react-redux";

import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import Contact from "../../../utils/interfaces/contact";

const ModuleForm = () => {
  const { value: title } = useInput((value) => regexGeneric.test(value));

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

  return (
    <form className="w-full flex flex-col gap-y-8 mt-8">
      <div className="flex flex-col gap-y-4">
        <label className="font-bold" htmlFor="title">
          Titre du module *
        </label>
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
        <label className="font-bold" htmlFor="level">
          Description
        </label>
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
        <label className="font-bold" htmlFor="level">
          Formateurs du module
        </label>
      </div>
    </form>
  );
};

export default ModuleForm;
