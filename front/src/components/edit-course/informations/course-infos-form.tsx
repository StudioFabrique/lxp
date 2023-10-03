import { useCallback, useEffect, useMemo, useRef } from "react";

import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

interface CourseInfosFormProps {
  courseTitle: string;
  courseDescription?: string;
  onSubmit: (data: { title: string; description: string }) => void;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    props.courseTitle
  );
  const { value: description } = useInput(
    (value) => regexOptionalGeneric.test(value),
    props.courseDescription
  );
  const isInitialRender = useRef(true);

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

  /**
   * liste des champs du formulaire, utile pour afficher les erreurs de validation
   * des champs qui n'ont pas été modifiés
   */
  const fields = useMemo(() => {
    return [title, description];
  }, [title, description]);

  // vérifie la validité du formulaire
  const formIsValid = title.isValid && description.isValid;

  // envoie au composant parent l'ordre de soumission du formulaire
  const handleSubmit = useCallback(
    (data: { title: string; description: string }) => {
      if (formIsValid) {
        props.onSubmit(data);
      } else {
        fields.forEach((field: any) => field.isSubmitted());
      }
    },
    [fields, formIsValid, props]
  );

  /**
   * détecte si un changement à lieu pour les valeurs title et description et
   * appele la fonction handleSubmit
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        handleSubmit({
          title: title.value,
          description: description.value,
        });
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [description.value, title.value, handleSubmit]);

  return (
    <>
      <form className="w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="title">
            Titre du parcours *
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
      </form>
    </>
  );
};

export default CourseInfosForm;
