/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import useHttp from "../../../hooks/use-http";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import Field from "../../UI/forms/field";
import FieldArea from "../../UI/forms/field-area";
import { infosSchema } from "../../../lib/validation/course/infos-schemas";
import { ZodError } from "zod";
import { validationErrors } from "../../../helpers/validate";
import useFormAutoSubmit from "../../UI/forms/hooks/use-form-auto-submit";

interface CourseInfosFormProps {
  courseId: number;
  courseTitle: string;
  courseDescription?: string;
  visibility: boolean;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const [visibility, setVisibility] = useState<boolean | null>(
    props.visibility
  );
  //const isInitialRender = useRef(true);
  const {
    errors,
    values,
    submit,
    setSubmit,
    onChangeValue,
    onValidationErrors,
    initValues,
  } = useFormAutoSubmit();

  const data = {
    values,
    onChangeValue,
    errors,
  };

  useEffect(() => {
    initValues({
      title: props.courseTitle,
      description: props.courseDescription,
    });
  }, [props.courseTitle, props.courseDescription, initValues]);

  // envoie au composant parent l'ordre de soumission du formulaire
  const handleSubmit = useCallback(() => {
    try {
      infosSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        toast.error(errors[0].message);
        return;
      }
    }
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
          title: values.title,
          description: values.description,
          visibility: visibility === undefined || !visibility ? false : true,
        },
      },
      applyData
    );
  }, [
    dispatch,
    sendRequest,
    values,
    visibility,
    props.courseId,
    onValidationErrors,
  ]);

  /**
   * détecte si un changement à lieu pour les valeurs title et description et
   * appele la fonction handleSubmit
   */
  useEffect(() => {
    let timer: any;
    if (submit) {
      timer = setTimeout(() => {
        handleSubmit();
        setSubmit(false);
      }, autoSubmitTimer);
    }
    return () => clearTimeout(timer);
  }, [submit, setSubmit, handleSubmit]);

  // gestion des erreurs http
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  /**
   * active l'auto submit lors d'un changement de valeur de la visibilité du cours
   */
  const handleChangeVisibility = () => {
    if (!submit) {
      setSubmit(true);
    }
    setVisibility((prevState) => !prevState);
  };

  return (
    <>
      <form className="w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <Field
            label="Titre du cours *"
            name="title"
            placeholder="Ex : Les bases du HTML"
            data={data}
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <FieldArea label="Description" name="description" data={data} />
        </div>

        <div className="form-control w-fit">
          <label className="flex gap-x-4 cursor-pointer items-center label">
            <span className="font-bold">Visibilité</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={visibility ? visibility : false}
              onChange={handleChangeVisibility}
            />
            <p className="text-sm">{visibility ? "Visible" : "Caché"}</p>
          </label>
        </div>
      </form>
    </>
  );
};

export default CourseInfosForm;
