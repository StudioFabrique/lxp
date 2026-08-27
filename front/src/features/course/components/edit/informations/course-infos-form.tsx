import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";

import { infosCourseSchema } from "../../../course.schema";
import FormInput from "../../../../../../src/components/form/FormInput";
import FormTextarea from "../../../../../../src/components/form/FormTextarea";
import useAutoSave from "../../../../../../src/hooks/useAutoSave";
import { getApiErrorMessage } from "../../../../../../src/utils/helpers/api-error-message";
import { courseApi } from "../../../api/course.api";

interface CourseInfosFormProps {
  courseId: number;
  courseTitle: string;
  courseDescription?: string;
  visibility: boolean;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const dispatch = useCourseDispatch();
  const [visibility, setVisibility] = useState<boolean | null>(
    props.visibility,
  );

  const defaultValues = useMemo(
    () => ({
      title: props.courseTitle,
      description: props.courseDescription ?? "",
    }),
    [props.courseTitle, props.courseDescription],
  );

  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(infosCourseSchema),
  });

  const saveCourse = useCallback(
    async (data: { title: string; description?: string }) => {
      try {
        const response = await courseApi.mutations.updateInfos({
          id: props.courseId,
          title: data.title,
          description: data.description,
          visibility: visibility === undefined || !visibility ? false : true,
        });
        if (response.success) {
          dispatch({ type: "SET_COURSE_INFOS", payload: response.data as { title: string; description: string; visibility: boolean } });
          toast.success(response.message);
        }
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, "Erreur inconnue"));
      }
    },
    [dispatch, props.courseId, visibility],
  );

  const onSave = useCallback(() => {
    rhfHandleSubmit(saveCourse, (errs) => {
      const firstError = Object.values(errs)[0];
      if (firstError?.message) toast.error(firstError.message);
    })();
  }, [rhfHandleSubmit, saveCourse]);

  useAutoSave(watch, onSave);

  const handleChangeVisibility = () => {
    setVisibility((prevState) => !prevState);
  };

  return (
    <>
      <form className="w-full flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-4">
          <FormInput
            label="Titre du cours *"
            name="title"
            register={register}
            error={errors.title}
            placeholder="Ex : Les bases du HTML"
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <FormTextarea
            label="Description"
            name="description"
            register={register}
            error={errors.description}
          />
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
