import { useCallback, useId, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import { autoSaveToastId } from "../../../../../config/auto-submit-timer";

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
  /** La visibilité n'a d'effet pour les apprenants qu'une fois le cours publié. */
  isPublished: boolean;
}

const CourseInfosForm = (props: CourseInfosFormProps) => {
  const dispatch = useCourseDispatch();
  const visibilityHintId = useId();

  const defaultValues = useMemo(
    () => ({
      title: props.courseTitle,
      description: props.courseDescription ?? "",
      visibility: props.visibility,
    }),
    [props.courseTitle, props.courseDescription, props.visibility],
  );

  const {
    reset,
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues,
    resolver: zodResolver(infosCourseSchema),
  });

  void dirtyFields;
  useEffect(() => {
    reset(defaultValues, { keepDirtyValues: true });
  }, [defaultValues, reset]);
  const visibility = watch("visibility");

  const saveCourse = useCallback(
    async (data: {
      title: string;
      description?: string;
      visibility: boolean;
    }) => {
      try {
        const response = await courseApi.mutations.updateInfos({
          id: props.courseId,
          title: data.title,
          description: data.description,
          visibility: data.visibility,
        });
        if (!response.success) throw new Error(response.message);
        if (response.success) {
          dispatch({
            type: "SET_COURSE_INFOS",
            payload: response.data as {
              title: string;
              description: string;
              visibility: boolean;
            },
          });
          toast.success(response.message, { id: autoSaveToastId });
        }
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, "Erreur inconnue"));
        throw err;
      }
    },
    [dispatch, props.courseId],
  );

  const onSave = useCallback(async () => {
    await rhfHandleSubmit(saveCourse, (errs) => {
      const firstError = Object.values(errs)[0];
      if (firstError?.message) toast.error(firstError.message);
    })();
  }, [rhfHandleSubmit, saveCourse]);

  useAutoSave(watch, onSave);

  return (
    <>
      <form
        className="w-full flex flex-col gap-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          void onSave().catch(() => undefined);
        }}
      >
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

        <div className="form-control flex w-fit flex-col gap-y-2">
          <label className="flex gap-x-4 cursor-pointer items-center label">
            <span className="font-bold">Visibilité</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              aria-describedby={visibilityHintId}
              {...register("visibility")}
            />
            <p className="text-sm">{visibility ? "Visible" : "Caché"}</p>
          </label>
          <p id={visibilityHintId} className="text-sm text-base-content/80">
            {props.isPublished
              ? "Ce cours est publié : il suit ce réglage de visibilité auprès des apprenants."
              : "Ce cours n'est pas publié : les apprenants ne le verront qu'après sa publication, quel que soit ce réglage."}
          </p>
        </div>
      </form>
    </>
  );
};

export default CourseInfosForm;
