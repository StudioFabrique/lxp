import toast from "react-hot-toast";
import { activiteMetaDataSchema } from "../../../../../../../src.legacy/lib/validation/lesson/activite-video";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import useForm from "../../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import useHttp from "../../../../../../../src/hooks/useHttp";
import { ZodError } from "zod";
import { validationErrors } from "../../../../../../utils/helpers/validate";
import { useEffect } from "react";

const useCreateBlog = (
  lessonId: string,
  activity: Activity | null,
  onCancel: () => void
) => {
  const { errors, values, onChangeValue, onValidationErrors, initValues } =
    useForm();
  const { sendRequest, isLoading } = useHttp();

  const handleSubmit = async (value: string) => {
    try {
      activiteMetaDataSchema.parse(values);

      const applyData = (_data: Activity) => {
        toast.success("Activité créée avec succès");
        onCancel();
      };

      sendRequest(
        {
          path: `/activity/text/${activity?.id ?? lessonId}`,
          method: activity?.title ? "put" : "post",
          body: {
            value,
            title: values.title,
          },
        },
        applyData
      );
    } catch (error) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        toast.error("Veuillez remplir tous les champs obligatoires");
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  useEffect(() => {
    if (activity) {
      initValues({
        title: activity.title,
        description: activity.description,
      });
    }
  }, [activity, initValues]);

  return {
    errors,
    values,
    onChangeValue,
    onValidationErrors,
    handleSubmit,
    isLoading,
    initValues,
  };
};
export default useCreateBlog;
