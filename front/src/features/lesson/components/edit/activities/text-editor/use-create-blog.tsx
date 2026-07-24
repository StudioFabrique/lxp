import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import { activiteMetaDataSchema } from "../../../../lesson.schema";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { lessonApi } from "../../../../api/lesson.api";

type BlogFormData = z.infer<typeof activiteMetaDataSchema>;

const useCreateBlog = (
  lessonId: string,
  activity: Activity | null,
  onCancel: () => void
) => {
  const {
    formState: { errors },
    getValues,
    watch,
    setValue,
    trigger,
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(activiteMetaDataSchema),
    defaultValues: { title: "", description: "" },
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (contentValue: string) => {
      const isValid = await trigger();
      if (!isValid) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const formValues = getValues();

      setIsLoading(true);
      lessonApi.mutations
        .upsertTextActivity(
          (activity?.id ?? lessonId) as string,
          { value: contentValue, title: formValues.title },
          activity?.title ? "put" : "post"
        )
        .then((_data: Activity) => {
          toast.success("Activité créée avec succès");
          onCancel();
        })
        .finally(() => setIsLoading(false));
    },
    [trigger, getValues, activity, lessonId, onCancel],
  );

  useEffect(() => {
    if (activity) {
      reset({
        title: activity.title ?? "",
        description: activity.description ?? "",
      });
    }
  }, [activity, reset]);

  return {
    errors,
    watch,
    setValue,
    handleSubmit,
    isLoading,
  };
};
export default useCreateBlog;
