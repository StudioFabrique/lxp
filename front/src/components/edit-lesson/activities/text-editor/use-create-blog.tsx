/* eslint-disable @typescript-eslint/no-unused-vars */
import toast from "react-hot-toast";
import { activiteMetaDataSchema } from "../../../../lib/validation/lesson/activite-video";
import Activity from "../../../../utils/interfaces/activity";
import useForm from "../../../UI/forms/hooks/use-form";
import useHttp from "../../../../hooks/use-http";
import { ZodError } from "zod";
import { validationErrors } from "../../../../helpers/validate";
import { useEffect } from "react";

const useCreateBlog = (
  lessonId: string,
  activity: Activity | null,
  onCancel: () => void
) => {
  // Hook de formulaire personnalisé pour la gestion des champs
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

      // Envoi de la requête au serveur
      sendRequest(
        {
          path: `/activity/text/${activity?.id ?? lessonId}`,
          method: activity?.title ? "put" : "post",
          body: {
            description: values.description,
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
