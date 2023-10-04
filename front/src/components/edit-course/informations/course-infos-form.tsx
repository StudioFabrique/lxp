import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useHttp from "../../../hooks/use-http";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";

interface CourseInfosFormProps {
  courseId: number;
  courseTitle: string;
  courseDescription?: string;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const dispatch = useDispatch();
  const { sendRequest, isLoading, error } = useHttp();
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

  // vérifie la validité du formulaire
  const formIsValid = title.isValid && description.isValid;

  // envoie au composant parent l'ordre de soumission du formulaire
  const handleSubmit = useCallback(() => {
    if (formIsValid) {
      const applyData = (data: any) => {
        if (data.success) {
          dispatch(courseInfosAction.setCourseInfos(data.data));
          toast.success(data.message);
        }
      };
      sendRequest(
        {
          path: "/course/infos",
          method: "put",
          body: {
            id: props.courseId,
            title: title.value,
            description: description.value,
          },
        },
        applyData
      );
    } else {
    }
  }, [
    dispatch,
    description.value,
    title.value,
    sendRequest,
    formIsValid,
    props.courseId,
  ]);

  /**
   * détecte si un changement à lieu pour les valeurs title et description et
   * appele la fonction handleSubmit
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        handleSubmit();
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [handleSubmit]);

  // gestion des erreurs http
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <form className="w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <span className="flex items-center gap-x-2">
            <label className="font-bold" htmlFor="title">
              Titre du cours *
            </label>
            {isLoading ? (
              <div className="loading loading-spinner text-primary loading-sm"></div>
            ) : null}
          </span>
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
          <span className="flex items-center gap-x-2">
            <label className="font-bold" htmlFor="description">
              Description
            </label>
            {isLoading ? (
              <div className="loading loading-spinner text-primary loading-sm"></div>
            ) : null}
          </span>
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
