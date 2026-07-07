/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import { ZodError } from "zod";

import { autoSubmitTimer } from "../../../../../../src.legacy/config/auto-submit-timer";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import Field from "../../../../../../src.legacy/components/UI/forms/field";
import FieldArea from "../../../../../../src.legacy/components/UI/forms/field-area";
import { infosCourseSchema } from "../../../../../../src.legacy/lib/validation/course/infos--course-schemas";

import { validationErrors } from "../../../../../../src.legacy/helpers/validate";
import useFormAutoSubmit from "../../../../../../src.legacy/components/UI/forms/hooks/use-form-auto-submit";

interface CourseInfosFormProps {
  courseId: number;
  courseTitle: string;
  courseDescription?: string;
  visibility: boolean;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const dispatch = useCourseDispatch();
  const { sendRequest, error } = useHttp();
  const [visibility, setVisibility] = useState<boolean | null>(
    props.visibility,
  );

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

  const handleSubmit = useCallback(() => {
    try {
      infosCourseSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        toast.error(errors[0].message);
      }
      return;
    }
    const applyData = (data: any) => {
      if (data.success) {
        dispatch({ type: "SET_COURSE_INFOS", payload: data.data });
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
      applyData,
    );
  }, [
    dispatch,
    sendRequest,
    values,
    visibility,
    props.courseId,
    onValidationErrors,
  ]);

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

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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
